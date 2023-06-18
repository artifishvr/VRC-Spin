const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Client } = require('node-osc');
const { autoUpdater } = require("electron-updater");


const client = new Client('127.0.0.1', 9000);

app.on('ready', () => {

  autoUpdater.checkForUpdatesAndNotify();

  const spinWin = new BrowserWindow({
    width: 535,
    height: 385,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    }
  });
  const controlWin = new BrowserWindow({
    width: 100,
    height: 100,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    }
  });
  function createSpinWindow() {
    spinWin.loadFile(path.join(__dirname, 'src/null.html'));
    spinWin.setPosition(10, 10);
    spinWin.setAlwaysOnTop(true);
    spinWin.setResizable(false);
    spinWin.hide();
  };
  function createControlWindow() {
    controlWin.loadFile(path.join(__dirname, 'src/control.html'));
    controlWin.setPosition(10, 10);
  };
  createSpinWindow();
  createControlWindow();

  ipcMain.on('startspin', () => {
    client.send('/input/LookRight', 1, () => { });
    client.send('/input/MoveLeft', 1, () => { });
    spinWin.loadFile(path.join(__dirname, 'src/index.html'));
    spinWin.show();
    controlWin.setPosition(10, 400);
  });
  
  ipcMain.on('stopspin', () => {
    client.send('/input/LookRight', 0, () => { });
    client.send('/input/MoveLeft', 0, () => { });
    spinWin.loadFile(path.join(__dirname, 'src/null.html'));
    spinWin.hide();
    controlWin.setPosition(10, 10);
  });

  controlWin.on('close', () => {
    client.send('/input/LookRight', 0, () => { });
    client.send('/input/MoveLeft', 0, () => { });
    spinWin.close();
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})