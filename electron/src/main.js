const { app } = require("electron");
const { createMainWindow } = require("./windowManager");
const { setupIPCHandlers } = require("./ipcHandlers");

let mainWindow;

function initializeApp() {
  mainWindow = createMainWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      mainWindow = createMainWindow();
    }
  });

  setupIPCHandlers();
}

app.on("ready", initializeApp);
