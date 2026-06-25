const { ipcMain } = require("electron");
const dashboardRepo = require("../repositories/dashboardRepo");

function registerDashboardHandlers() {
  ipcMain.handle("get-dashboard-stats", async () => {
    return await dashboardRepo.getStats();
  });
}

module.exports = { registerDashboardHandlers };
