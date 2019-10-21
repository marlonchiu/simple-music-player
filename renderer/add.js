const {
  ipcRenderer
} = require('electron')
const {
  $
} = require('./helper')
const path = require('path')

let musicFilesPath = []
$('select-music-btn').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')
})

$('import-music-btn').addEventListener('click', () => {
  ipcRenderer.send('import-tracks', musicFilesPath)
})

const renderListHTML = (paths) => {
  const musicList = $('music-list')
  const musicItemsHTML = paths.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}
// 接收选择的音乐文件
ipcRenderer.on('selected-file', (event, path) => {
  if (Array.isArray(path)) {
    renderListHTML(path)
    musicFilesPath = path
  }
})
