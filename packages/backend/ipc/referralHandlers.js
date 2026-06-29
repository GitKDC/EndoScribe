const { ipcMain } = require("electron");
const referralRepo = require("../repositories/referralRepo");
const { syncContacts, getSetting, setSetting } = require("../services/googleContacts");

function registerReferralHandlers() {
  ipcMain.handle("create-referral", async (_, data) => {
    return await referralRepo.createReferral(data);
  });

  ipcMain.handle("get-referrals", async (_, filters) => {
    return await referralRepo.searchReferrals(filters);
  });

  ipcMain.handle("get-referral", async (_, id) => {
    return await referralRepo.getReferral(id);
  });

  ipcMain.handle("update-referral", async (_, data) => {
    const { id, ...rest } = data;
    return await referralRepo.updateReferral(id, rest);
  });

  ipcMain.handle("delete-referral", async (_, id) => {
    return await referralRepo.deleteReferral(id);
  });

  ipcMain.handle("get-google-credentials", async () => {
    return {
      clientId: await getSetting("google_client_id"),
      clientSecret: await getSetting("google_client_secret")
    };
  });

  ipcMain.handle("set-google-credentials", async (_, data) => {
    await setSetting("google_client_id", data.clientId);
    await setSetting("google_client_secret", data.clientSecret);
    return true;
  });

  ipcMain.handle("sync-google-contacts", async (_, data) => {
    let clientId = data?.clientId || await getSetting("google_client_id");
    let clientSecret = data?.clientSecret || await getSetting("google_client_secret");
    
    if (!clientId || !clientSecret) {
      throw new Error("Missing Google Client ID or Secret. Please configure them first.");
    }
    return await syncContacts(clientId, clientSecret);
  });
}

module.exports = { registerReferralHandlers };
