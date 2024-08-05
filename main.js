import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })


  // 设置更新后的 CSP 和 CORS 头
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Access-Control-Allow-Origin': ['http://localhost:5173'],
        'Access-Control-Allow-Credentials': ['true'],
        'Access-Control-Allow-Methods': ['GET, POST, OPTIONS, PUT, DELETE'],
        'Access-Control-Allow-Headers': ['Origin, X-Requested-With, Content-Type, Accept'],
      }
    })
  })

    // 处理预检请求
    win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
      if (details.method === 'OPTIONS') {
        callback({ cancel: false, responseHeaders: {
          'Access-Control-Allow-Origin': ['http://localhost:5173'],
          'Access-Control-Allow-Methods': ['GET, POST, OPTIONS, PUT, DELETE'],
          'Access-Control-Allow-Headers': ['Origin, X-Requested-With, Content-Type, Accept'],
        } })
      } else {
        callback({ cancel: false })
      }
    })

  // 加载应用的 index.html
  win.loadFile('index.html')
  
  // 下面的url为自己启动vite项目的url。
  win.loadURL('http://localhost:5173/')
  // 打开electron的开发者工具
  win.webContents.openDevTools({ mode: 'detach' })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // 处理来自渲染进程的消息
  ipcMain.on('send-message', (event, message) => {
    console.log('Received message from renderer:', message)
    // 在这里处理消息，比如发送到后端服务器
  })

  // 处理获取应用版本的请求
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  // 处理打开外部链接的请求
  ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
