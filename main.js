// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog
} = require('electron')
const DataStore = require('./renderer/MusicDataStore')
const myStore = new DataStore({
  'name': 'Music Data'
})
class AppWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const baseConfig = {
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true // 表示可以使用nodejs的API
      }
    }
    // const finalConfig = Object.assign(baseConfig, config)
    const finalConfig = {
      ...baseConfig,
      ...config
    }
    super(finalConfig)
    this.loadFile(fileLocation)
    // 优化显示
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

let mainWindow

app.on('ready', () => {
  mainWindow = new AppWindow({}, './renderer/index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  ipcMain.on('add-music-window', (event, arg) => {
    const addWindow = new AppWindow({
      width: 800,
      height: 600,
      parent: mainWindow
    }, './renderer/add.html')
  })

  ipcMain.on('open-music-file', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{
        name: 'Music',
        extensions: ['mp3']
      }]
    }, (files) => {
      // console.log(files)
      if (files) {
        event.sender.send('selected-file', files)
      }
    })
  })
  // 导入音乐
  ipcMain.on('import-tracks', (event, tracks) => {
    // console.log(tracks)
    const updateTracks = myStore.addTracks(tracks).getTracks()
    console.log(updateTracks)
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
