const { ipcMain } = require("electron");
const { selectFolder, copyFiles } = require("../ipc/fileCopy");
const { runPythonScript } = require("./pythonExecutor");

function setupIPCHandlers() {
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
