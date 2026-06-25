const { ipcMain } = require("electron");
const referralRepo = require("../repositories/referralRepo");

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
}

module.exports = { registerReferralHandlers };
