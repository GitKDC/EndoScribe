const { ipcMain } = require("electron");
const db = require("../db/db");

const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../repositories/templateRepo");

const registerTemplateHandlers = () => {
  // GET ALL
  ipcMain.handle("get-templates", async () => {
    return await getTemplates(db);
  });

  // GET ONE
  ipcMain.handle("get-template", async (_, id) => {
    return await getTemplate(id, db);
  });

  // CREATE
  ipcMain.handle("create-template", async (_, data) => {
    return await createTemplate(data, db);
  });

  // UPDATE
  ipcMain.handle("update-template", async (_, id, data) => {
    return await updateTemplate(id, data, db);
  });

  // DELETE
  ipcMain.handle("delete-template", async (_, id) => {
    return await deleteTemplate(id, db);
  });
};

module.exports = { registerTemplateHandlers };