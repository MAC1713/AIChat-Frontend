import { contextBridge, ipcRenderer } from 'electron'

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到主进程
  sendMessage: (message) => ipcRenderer.send('send-message', message),
  
  // 从主进程接收消息
  receiveMessage: (callback) => ipcRenderer.on('receive-message', (event, message) => callback(message)),
  
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 打开外部链接
  openExternalLink: (url) => ipcRenderer.send('open-external-link', url)
})

// 添加一些安全策略
window.addEventListener('DOMContentLoaded', () => {
  // 禁用或移除任何不安全的特性
  delete window.open
  delete window.alert
  delete window.confirm
  delete window.prompt
})