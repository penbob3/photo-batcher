const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
    readFolder: (path) => ipcRenderer.invoke('files:readFolder', path),
    //getImage: (path) => ipcRenderer.invoke('files:getImage', path)
})