/**
 * buildEndoUrl
 * ──────────────────────────────────────────────────────────────────────────
 * Safely turns an absolute filesystem path into an `endo://` URL that the
 * main-process protocol handler can resolve back to a real file.
 *
 * WHY THIS EXISTS:
 * Image preview was broken for two stacked reasons:
 *
 * 1. Naive string concatenation (`endo://${img.file_path}`) never
 *    percent-encoded the path, so spaces (e.g. macOS's "Application
 *    Support" folder) corrupted the URL the moment it hit <img src>.
 *
 * 2. Even after percent-encoding, `endo://` is registered as a *standard*
 *    scheme (`standard: true`), which means Chromium parses it like
 *    http(s): the first path segment after "://" up to the next "/" is
 *    treated as the URL's HOST/AUTHORITY, not as part of the path — and
 *    hosts get lower-cased per the URL spec. So:
 *
 *      endo://Users/kartikchaudhari/foo.jpg
 *             ^^^^^ parsed as hostname "users", NOT part of the path!
 *
 *    If the path we're encoding doesn't keep a clearly-empty host segment
 *    (i.e. doesn't start with exactly "///" after the scheme), the first
 *    real directory name silently gets eaten and lower-cased as a "host".
 *    This is why logs showed paths missing "/Users" or showing "users"
 *    in lowercase — the file lookup then 404s even though the real file
 *    is sitting right there on disk.
 *
 * THE FIX: always force a triple-slash form — `endo:///<path>` — so the
 * host segment is unambiguously empty and the ENTIRE path is preserved
 * in `pathname`, with original casing intact. We do this by stripping any
 * leading slashes off the normalized path ourselves and adding exactly
 * three slashes back, rather than relying on the path's own leading "/"
 * to "just happen" to produce three slashes when concatenated.
 */
function buildEndoUrl(absolutePath) {
  if (!absolutePath) return "";

  // Normalize Windows backslashes to forward slashes for URL purposes.
  let normalized = absolutePath.replace(/\\/g, "/");

  // Strip any leading slash(es) so we control exactly how many slashes
  // follow "endo:" — this guarantees the host segment is always empty,
  // regardless of whether the incoming path had 0, 1, or more leading
  // slashes (defensive against any upstream path-joining quirks).
  normalized = normalized.replace(/^\/+/, "");

  // Encode each path segment individually so real slashes are preserved
  // but spaces, #, ?, % etc. inside file/folder names are escaped.
  const encoded = normalized
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  // Exactly three slashes: "endo:" + "//" (scheme separator) + "/" (empty
  // host) + path. This is the only form that is unambiguous for a
  // standard scheme and guarantees Chromium can never mistake the first
  // path segment for a hostname.
  return `endo:///${encoded}`;
}

module.exports = { buildEndoUrl };