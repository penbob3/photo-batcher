import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import * as fs from 'fs'
const { performance } = require('perf_hooks')
import { ExifTool } from "exiftool-vendored"
const exiftool = new ExifTool({})
const ProgressBar = require('electron-progressbar')

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled) {
    return filePaths[0]
  }
}

const maxFileSizeMB = 75
const bitMByteMultiplayer = 1000000

async function getRawImage(thispath) {
  console.log('Doing file: ' + thispath)
  try {
    const tags = await exiftool.read(thispath)
    const thumbnailpath = thispath.split(".").slice(0, -1).join("") + "-thumb.jpg"
    if (!fs.existsSync(thumbnailpath)) {
      //console.log("being called?")
      await exiftool.extractPreview(thispath, thumbnailpath)
      if (tags.Orientation == 8) { await exiftool.write(thumbnailpath, { Orientation: 'Rotate 270 CW' }) }
    }
    return { exifTags: tags, thumbnailPath: thumbnailpath }
  } catch(e) {
    console.log(e)
    return null
  }
}

async function getRawImages(files) {
  const filesFiltered = files.filter((file) => { return file.split(".").pop().toUpperCase() == "NEF" })
  let exifList = []
  var progressBar = new ProgressBar({
    indeterminate: false,
    text: 'Loading RAW Files...',
    detail: 'Wait...',
    initialValue: 0,
    maxValue: filesFiltered.length
  })
  progressBar
  .on('progress', function(value) {
    progressBar.detail = `Loaded ${value} of ${progressBar.getOptions().maxValue} RAW files...`;
  })
  .on('completed', function() {
    console.info(`completed...`);
    progressBar.detail = 'RAW Files Loaded!';
  })
  for (const file of filesFiltered) {
    let exifTags = await getRawImage(file)
    if(!progressBar.isCompleted()){
      progressBar.value += 1
    }
    if (exifTags) { exifList.push(exifTags) }
  }
  return exifList
}

async function getRawImagesParallel(files) {
  try {
    //let exifList = await async.each(files, getOneImageExif)
    //let exifList = await getOneImageExif(files[0])
    const chunkSize = 40
    const filesFiltered = files.filter((file) => { return file.split(".").pop().toUpperCase() == "NEF" })
    const chunkList = [...chunks(filesFiltered, chunkSize)]
    let exifList = []

    for (const chunk of chunkList) {
      let exifChunk = await Promise.all(chunk.map(async file => {
        return await getRawImage(file)
      }))
      exifList.push(...exifChunk)
    }
    
    return exifList
  } catch (e) {
    console.log(e)
    return null
  }
}

async function handleReadFolder(event, thispath) {
  const folderContents = fs.readdirSync(thispath, { withFileTypes: true })
  let imageList = await getRawImages(folderContents.map((file) => file.path + '\\' + file.name))
  console.log(imageList)
  return imageList
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('dialog:openFolder', handleFolderOpen)
  ipcMain.handle('files:readFolder', handleReadFolder)
  //ipcMain.handle('files:getImage', handleGetImage)
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
