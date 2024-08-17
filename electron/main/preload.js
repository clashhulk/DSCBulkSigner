const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  copyFiles: (source, destination) =>
    ipcRenderer.invoke("copy-files", source, destination),
  getDSCList: () => ipcRenderer.invoke("get-dsc-list"),
});
