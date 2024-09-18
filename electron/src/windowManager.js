const { BrowserWindow } = require("electron");
const path = require("path");
const { WINDOW_OPTIONS } = require("./config");

function createMainWindow() {
  var mainWindow = new BrowserWindow({
    ...WINDOW_OPTIONS,
    webPreferences: {
      preload: path.join(__dirname, "./../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL(WINDOW_OPTIONS.defaultURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  return mainWindow;
}

module.exports = {
  createMainWindow,
};
