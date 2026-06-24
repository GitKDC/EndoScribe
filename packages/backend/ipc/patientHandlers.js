const { ipcMain } = require("electron");
const patientRepo = require("../repositories/patientRepo");

function registerPatientHandlers() {
  ipcMain.handle("create-patient", async (_, data) => {
    return await patientRepo.createPatient(data);
  });

  ipcMain.handle("get-patients", async (_, query) => {
    return await patientRepo.searchPatients(query);
  });

  ipcMain.handle("get-patient", async (_, id) => {
    return await patientRepo.getPatient(id);
  });

  ipcMain.handle("update-patient", async (_, data) => {
    const { id, ...rest } = data;
    return await patientRepo.updatePatient(id, rest);
  });

  ipcMain.handle("delete-patient", async (_, id) => {
    return await patientRepo.deletePatient(id);
  });
}

module.exports = { registerPatientHandlers };
