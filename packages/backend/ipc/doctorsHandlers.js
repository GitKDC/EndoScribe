const { ipcMain } = require("electron");
const db = require("../db/db");

const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  seedDefaultDoctors,
} = require("../repositories/doctorsRepo");

const registerDoctorHandlers = () => {
  // Seed default doctors on first run (no-op if already seeded)
  seedDefaultDoctors(db).catch((err) =>
    console.error("❌ Error seeding default doctors:", err)
  );

  // GET ALL
  ipcMain.handle("get-doctors", async () => {
    return await getDoctors(db);
  });

  // GET ONE
  ipcMain.handle("get-doctor", async (_, id) => {
    return await getDoctor(id, db);
  });

  // CREATE
  ipcMain.handle("create-doctor", async (_, data) => {
    return await createDoctor(data, db);
  });

  // UPDATE
  ipcMain.handle("update-doctor", async (_, id, data) => {
    return await updateDoctor(id, data, db);
  });

  // DELETE
  ipcMain.handle("delete-doctor", async (_, id) => {
    return await deleteDoctor(id, db);
  });
};

module.exports = { registerDoctorHandlers };