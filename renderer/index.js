const {
  ipcRenderer
} = require('electron')
const {
  $,
  convertDuration
} = require('./helper')
// 定义一些变量
let musicAudio = new Audio()
let allTracks
let currentTrack

$('add-music-btn').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})
const renderTracksHTML = (tracks) => {
  const tracksList = $('tracksList')
  const tracksListHTML = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
      <div class="col-10">
        <i class="fas fa-music mr-2 text-secondary"></i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
        <i class="fas fa-play mr-3" data-id="${track.id}"></i>
        <i class="fas fa-trash-alt" data-id="${track.id}"></i>
      </div>
    </li>`
    return html
  }, '')

  const emptyTracksHTML = '<div class="alert alert-primary">您还没有添加任何音乐</div>'
  tracksList.innerHTML = tracks.length ? tracksListHTML : emptyTracksHTML
}
// 监听歌曲导入事件
ipcRenderer.on('getTracks', (event, tracks) => {
  console.log(tracks)
  allTracks = tracks
  renderTracksHTML(tracks)
})

const renderPlayerHTML = (name, duration) => {
  const player = $('player-status')
  const html = `<div class="col col-9 font-weight-bold">
                  正在播放：${name}
                </div>
                <div class="col col-3">
                  <span id="current-seeker">00:00</span> / ${convertDuration(duration)}
                </div>`
  player.innerHTML = html
}
const updateProgressHTML = (currentTime, duration) => {
  // 更新播放器进度条
  const progress = Math.floor(currentTime / duration * 100)
  const playerBar = $('palyer-progress')
  playerBar.innerHTML = progress + '%'
  playerBar.style.width =  progress + '%'

  // 更新显示事件
  const seeker = $('current-seeker')
  seeker.innerHTML = convertDuration(currentTime)
}
// 播放器状态
musicAudio.addEventListener('loadedmetadata', () => {
  // 渲染播放器状态
  renderPlayerHTML(currentTrack.fileName, musicAudio.duration)
})
musicAudio.addEventListener('timeupdate', () => {
  // 播放时间更新
  updateProgressHTML(musicAudio.currentTime, musicAudio.duration)
})

// 点击播放item
$('tracksList').addEventListener('click', (event) => {
  event.preventDefault()
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Element/classList
  const {
    dataset,
    classList
  } = event.target
  const id = dataset && dataset.id
  if (id && classList.contains('fa-play')) {
    // 音乐开始播放
    if (currentTrack && currentTrack.id === id) {
      // 继续接着原来的播放
      musicAudio.play()
    } else {
      // 播放新的歌曲，注意还原之前的图标
      currentTrack = allTracks.find(track => track.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      const resetIconEle = document.querySelector('.fa-pause')
      if (resetIconEle) {
        resetIconEle.classList.replace('fa-pause', 'fa-play')
      }
    }
    classList.replace('fa-play', 'fa-pause')
  } else if (id && classList.contains('fa-pause')) {
    // 处理暂停逻辑
    musicAudio.pause()
    classList.replace('fa-pause', 'fa-play')
  } else if (id && classList.contains('fa-trash-alt')) {
    // 发送事件删除这条音乐
    ipcRenderer.send('delete-track', id)
  }
})
