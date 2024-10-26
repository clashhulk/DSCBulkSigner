const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  listConnectedDsc: () => ipcRenderer.invoke("list-DSC"),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  copyFiles: (source, dest) => ipcRenderer.invoke("copy-files", source, dest),
  runPythonScript: () => ipcRenderer.invoke("run-python-script"),
});
