import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { setup_global_event } from "../preload/setup_global_event";
import { setup_window_event } from "../preload/setup_window_event";

import icon from '../../resources/icon.png?asset'
// import appIcon from '../../resources/app-store.png?asset'

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  // Create the browser window.
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

  setup_global_event(ipcMain);

  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-hid-device` is called.
    // console.log("event:", event)
    // mainWindow?.webContents.session.on('hid-device-added', (_event, device) => {
    // console.log('hid-device-added FIRED WITH', device)
    // Optionally update details.deviceList
    // details.deviceList.push(device);
    // })

    // mainWindow?.webContents.session.on('hid-device-removed', (_event, device) => {
    // console.log('hid-device-removed FIRED WITH', device)
    // Optionally update details.deviceList
    // })
    // event.preventDefault()
    // if (details.deviceList && details.deviceList.length > 0) {
    // callback(details.deviceList[0].deviceId)
    // }
  })

  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission, _requestingOrigin, details) => {
    // if (permission === 'hid' && details.securityOrigin === 'file:///') {
    return true
    // }
    // return false
  })

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    // if (details.deviceType === 'hid' && details.origin === 'file://') {
    return true
    // }
    // return false
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
