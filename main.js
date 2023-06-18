const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Client } = require('node-osc');
const { autoUpdater } = require("electron-updater");

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
    width: 120,
    height: 80,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    }
  });
  function createSpinWindow() {
    spinWin.loadURL("steam://launch/438100");
    spinWin.setPosition(10, 10);
    spinWin.setAlwaysOnTop(true);
    spinWin.setResizable(false);
    spinWin.hide();
  };
  function createControlWindow() {
    controlWin.loadFile(path.join(__dirname, 'src/control.html'));
    controlWin.setPosition(10, 10);
    controlWin.setResizable(false);
    controlWin.setAlwaysOnTop(true);
  };
  createSpinWindow();
  createControlWindow();

  ipcMain.on('startspin', () => {
    const OSCClient = new Client('127.0.0.1', 9000);
    OSCClient.send('/input/LookRight', 1, () => { });
    spinWin.loadFile(path.join(__dirname, 'src/index.html'));
    spinWin.show();
    controlWin.setPosition(10, 400);
  });

  ipcMain.on('stopspin', () => {
    const OSCClient = new Client('127.0.0.1', 9000);
    OSCClient.send('/input/LookRight', 0, () => { });
    spinWin.loadFile(path.join(__dirname, 'src/null.html'));
    spinWin.hide();
    controlWin.setPosition(10, 10);
  });

  controlWin.on('close', () => {
    const OSCClient = new Client('127.0.0.1', 9000);
    OSCClient.send('/input/LookRight', 0, () => { });
    spinWin.close();
  });

});