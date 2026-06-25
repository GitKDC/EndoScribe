const { ipcMain } = require("electron");
const categoryRepo = require("../repositories/categoryRepo");

const registerCategoryHandlers = () => {
  ipcMain.handle("get-categories", async () => {
    try {
      return await categoryRepo.getAllCategories();
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle("create-category", async (event, data) => {
    try {
      return await categoryRepo.createCategory(data);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle("update-category", async (event, id, data) => {
    try {
      return await categoryRepo.updateCategory(id, data);
    } catch (err) {
      throw err;
    }
  });

  ipcMain.handle("delete-category", async (event, id) => {
    try {
      return await categoryRepo.deleteCategory(id);
    } catch (err) {
      throw err;
    }
  });
};

module.exports = {
  registerCategoryHandlers,
};
