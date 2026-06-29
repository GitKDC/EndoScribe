const http = require("http");
const url = require("url");
const { shell } = require("electron");
const db = require("../db/db");

// Retrieve settings from DB
const getSetting = (key) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.value : null);
    });
  });
};

const setSetting = (key, value) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?",
      [key, value, value],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const REDIRECT_URI = "http://localhost:3456/oauth2callback";

const initiateOAuthFlow = async (clientId) => {
  return new Promise((resolve, reject) => {
    // 1. Start local server
    const server = http.createServer(async (req, res) => {
      try {
        const reqUrl = url.parse(req.url, true);
        if (reqUrl.pathname === "/oauth2callback") {
          const code = reqUrl.query.code;
          if (code) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("<h1>Success!</h1><p>You can close this tab and return to the app.</p><script>window.close();</script>");
            server.close();
            resolve(code);
          } else {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("<h1>Error</h1><p>No authorization code found.</p>");
            server.close();
            reject(new Error("No code found"));
          }
        }
      } catch (err) {
        console.error("OAuth server error", err);
        server.close();
        reject(err);
      }
    });

    server.listen(3456, () => {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent("https://www.googleapis.com/auth/contacts.readonly")}&access_type=offline&prompt=consent`;
      shell.openExternal(authUrl);
    });
    
    // Timeout after 3 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("OAuth flow timed out"));
    }, 3 * 60 * 1000);
  });
};

const exchangeCodeForTokens = async (clientId, clientSecret, code) => {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", REDIRECT_URI);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to exchange code: ${errorText}`);
  }
  
  return await res.json();
};

const refreshAccessToken = async (clientId, clientSecret, refreshToken) => {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("refresh_token", refreshToken);
  params.append("grant_type", "refresh_token");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  
  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }
  
  return await res.json();
};

const fetchGoogleContacts = async (accessToken) => {
  let contacts = [];
  let nextPageToken = null;

  do {
    const url = new URL("https://people.googleapis.com/v1/people/me/connections");
    url.searchParams.append("personFields", "names,phoneNumbers,organizations,emailAddresses");
    url.searchParams.append("pageSize", "1000");
    if (nextPageToken) url.searchParams.append("pageToken", nextPageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) throw new Error("Failed to fetch contacts");

    const data = await res.json();
    if (data.connections) {
      contacts = contacts.concat(data.connections);
    }
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return contacts;
};

const syncContacts = async (clientId, clientSecret) => {
  let refreshToken = await getSetting("google_refresh_token");
  let accessToken = null;

  if (!refreshToken) {
    // No refresh token, need to authenticate
    const code = await initiateOAuthFlow(clientId);
    const tokens = await exchangeCodeForTokens(clientId, clientSecret, code);
    
    if (tokens.refresh_token) {
      await setSetting("google_refresh_token", tokens.refresh_token);
    }
    accessToken = tokens.access_token;
  } else {
    // Have refresh token, just refresh access token
    try {
      const tokens = await refreshAccessToken(clientId, clientSecret, refreshToken);
      accessToken = tokens.access_token;
    } catch (err) {
      // If refresh fails (e.g. revoked), restart flow
      const code = await initiateOAuthFlow(clientId);
      const tokens = await exchangeCodeForTokens(clientId, clientSecret, code);
      if (tokens.refresh_token) {
        await setSetting("google_refresh_token", tokens.refresh_token);
      }
      accessToken = tokens.access_token;
    }
  }

  const rawContacts = await fetchGoogleContacts(accessToken);
  
  let added = 0;
  for (const contact of rawContacts) {
    const name = contact.names?.[0]?.displayName;
    const phone = contact.phoneNumbers?.[0]?.value || contact.phoneNumbers?.[0]?.canonicalForm;
    const clinic = contact.organizations?.[0]?.name;
    
    if (name) {
      // Basic deduplication: check if name or phone already exists
      const existing = await new Promise((res, rej) => {
        db.get(
          "SELECT id FROM referral_doctors WHERE name = ? COLLATE NOCASE OR (phone = ? AND phone IS NOT NULL)",
          [name, phone],
          (err, row) => err ? rej(err) : res(row)
        );
      });

      if (!existing) {
        await new Promise((res, rej) => {
          db.run(
            "INSERT INTO referral_doctors (name, phone, clinic_name) VALUES (?, ?, ?)",
            [name, phone || null, clinic || null],
            (err) => err ? rej(err) : res()
          );
        });
        added++;
      }
    }
  }

  return { totalFetched: rawContacts.length, added };
};

module.exports = { syncContacts, getSetting, setSetting };
