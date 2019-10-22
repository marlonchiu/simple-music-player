exports.$ = (id) => {
  return document.getElementById(id)
}
// 处理时间
exports.convertDuration = (time) => {
  // 计算分钟  单位数 ‘01’ 多位数显示 ‘020’
  const minutes = '0' + Math.floor(time / 60)
  // 计算秒  单位数 ‘01’ 多位数显示 ‘060’
  const seconds = '0' + Math.floor(time - minutes * 60)
  return minutes.substr(-2) + ':' + seconds.substr(-2)
}
