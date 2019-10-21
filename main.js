// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // 表示可以使用nodejs的API
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  ipcMain.on('message', (event, arg) => {
    console.log(arg)
    // event.sender.send('reply', 'hello from main')
    mainWindow.send('reply', 'hello from mainWindow')
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
