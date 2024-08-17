const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  copyFiles: (source, destination) => ipcRenderer.invoke('copy-files', source, destination),
});
