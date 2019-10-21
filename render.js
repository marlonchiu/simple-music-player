const {
  ipcRenderer
} = require('electron')

// 使用dom api
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('message', 'hello from render')
  ipcRenderer.on('reply', (event, arg) => {
    console.log(arg)
    document.getElementById('message').innerHTML = arg
  })
})
