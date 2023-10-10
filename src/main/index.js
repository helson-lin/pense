import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let winSize = 200
function changeWinSize(command) {
  if (command === 'max') {
    if (winSize === 800) return
    winSize += 10
  } else {
    if (winSize === 100) return
    winSize -= 10
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: winSize,
    height: winSize,
    show: false,
    frame: false,
    transparent: true,
    maximizable: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  ipcMain.on('size', (_, command) => {
    changeWinSize(command)
    mainWindow.setSize(winSize, winSize)
  })
  ipcMain.on('fixed', (_, fixed) => {
    mainWindow && mainWindow.setAlwaysOnTop(fixed)
  })
  ipcMain.on('quit', () => app.quit())
  ipcMain.on('move', (_, args) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return
    // 获取屏幕大小
    const width = screen.getPrimaryDisplay().workAreaSize.width
    const height = screen.getPrimaryDisplay().workAreaSize.height
    const positionList = [
      [0, 0],
      [width - window.getSize()[0], height - window.getSize()[1]]
    ]
    const positionInfo = positionList[(args || 'right') === 'right' ? 1 : 0]
    window.setPosition(positionInfo[0], positionInfo[1])
  })
  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
