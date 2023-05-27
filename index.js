const { app, BrowserWindow } = require('electron')
const path = require('path')
const { Client } = require('node-osc');

const client = new Client('127.0.0.1', 9000);

function createWindow () {
  const win = new BrowserWindow({
    width: 535,
    height: 385,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  win.setPosition(10, 10)
}

app.whenReady().then(() => {
  createWindow()

  client.send('/input/LookRight', 1, () => {
    client.close();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit()
  }
})