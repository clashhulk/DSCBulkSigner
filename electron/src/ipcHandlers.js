const { ipcMain } = require("electron");
const { selectFolder, copyFiles } = require("../ipc/fileCopy");
const {
  getListConnectedDsc,
  verifyAndGetDscInfo,
} = require("../ipc/accessDsc.js");
const { runPythonScript } = require("./pythonExecutor");

function setupIPCHandlers() {
  ipcMain.handle("list-DSC", async () => {
    const listConnectedDsc = getListConnectedDsc();
    return listConnectedDsc;
  });

  ipcMain.handle("login-DSC", async (event, slotId, pin) => {
    const listConnectedDsc = verifyAndGetDscInfo(slotId, pin);
    return listConnectedDsc;
  });
  ipcMain.handle("select-folder", async () => {
    const folderPath = await selectFolder();
    return folderPath;
  });

  ipcMain.handle("copy-files", async (event, sourcePath, destinationPath) => {
    const result = await copyFiles(sourcePath, destinationPath);
    return result;
  });

  ipcMain.handle("run-python-script", async () => {
    try {
      const output = await runPythonScript();
      return output;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  });
}

module.exports = {
  setupIPCHandlers,
};
