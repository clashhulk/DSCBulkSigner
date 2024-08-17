const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { selectFolder, copyFiles } = require("./ipc/fileCopy");
const { exec } = require("child_process");
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("select-folder", async () => {
  const folderPath = await selectFolder();
  return folderPath;
});

ipcMain.handle("copy-files", async (event, sourcePath, destinationPath) => {
  const result = await copyFiles(sourcePath, destinationPath);
  return result;
});

ipcMain.handle("get-dsc-list", async () => {
  return new Promise((resolve, reject) => {
    exec("certutil -store -user my", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        const certificates = parseCertificates(stdout);
        resolve(certificates);
      }
    });
  });
});

function parseCertificates(output) {
  const certArray = [];
  const certBlocks = output.split("------------------");
  certBlocks.forEach((block) => {
    const cert = {};
    const lines = block.split("\n");
    lines.forEach((line) => {
      if (line.includes("Serial Number:")) {
        cert.serialNumber = line.split(": ")[1];
      } else if (line.includes("Issuer:")) {
        cert.issuer = line.split(": ")[1];
      } else if (line.includes("NotBefore:")) {
        cert.validFrom = line.split(": ")[1];
      } else if (line.includes("NotAfter:")) {
        cert.validTo = line.split(": ")[1];
      }
    });
    if (Object.keys(cert).length > 0) {
      certArray.push(cert);
    }
  });

  return certArray;
}
