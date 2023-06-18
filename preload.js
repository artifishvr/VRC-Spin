const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  startspin: () => {
    ipcRenderer.send('startspin');
  },
  stopspin: () => {
    ipcRenderer.send('stopspin');
  },
});