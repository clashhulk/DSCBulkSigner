const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  listConnectedDsc: () => ipcRenderer.invoke("list-DSC"),
  verifyAndGetDscInfo: (slotId, pin) =>
    ipcRenderer.invoke("login-DSC", slotId, pin),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  copyFiles: (source, dest) => ipcRenderer.invoke("copy-files", source, dest),
  runPythonScript: () => ipcRenderer.invoke("run-python-script"),
});
