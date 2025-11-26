import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { setup_global_event } from "../preload/setup_global_event";
import { setup_window_event } from "../preload/setup_window_event";

import icon from '../../resources/icon.png?asset'

let mainWindow = null;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: "#ffffff",
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      devTools: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  setup_window_event(ipcMain, mainWindow);
  setup_global_event(ipcMain, app);

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => { })

  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission, _requestingOrigin, details) => {
    return true
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    return true
  })
  mainWindow.webContents.openDevTools();
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const tray = new Tray(nativeImage.createFromPath(icon));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'show app', click: () => { if (mainWindow) mainWindow.show(); } },
    { label: 'exit', click: () => app.quit() }
  ]);
  tray.on('click', () => {
    if (mainWindow) mainWindow.show();
  });
  tray.setToolTip('my app');
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }

  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})