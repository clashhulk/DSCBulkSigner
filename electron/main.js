const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { selectFolder, copyFiles } = require('./api/fileCopy'); // Import the functions

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000'); // Assuming your React app runs on this URL

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handler for selecting a folder
ipcMain.handle('select-folder', async () => {
  const folderPath = await selectFolder();
  return folderPath; // Send the selected folder path back to the frontend
});

// IPC handler for copying files
ipcMain.handle('copy-files', async (event, sourcePath, destinationPath) => {
  const result = await copyFiles(sourcePath, destinationPath);
  return result; // Send the result of the copy operation back to the frontend
});
