import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import started from 'electron-squirrel-startup'
import * as fs from 'fs'
const util = require('util');
const readFileProm = util.promisify(fs.readFile)
import ExifReader from 'exifreader'
import {DOMParser, onErrorStopParsing} from '@xmldom/xmldom'
const { performance } = require('perf_hooks')

async function handleFolderOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (!canceled) {
    return filePaths[0]
  }
}

const maxFileSizeMB = 75
const bitMByteMultiplayer = 1000000

function readFilesParallel1(files) {
  return Promise.all(
    files.map(async (path) => {
      let fullPath = file.path + '\\' + file.name
      let fileInfo = fs.statSync(fullPath)
      if (fileInfo.size < bitMByteMultiplayer * maxFileSizeMB) {
        if (idx % 100 == 0) console.log(`Getting file ${idx} of ${folderContents.length}: ${fullPath}`)
        try {
          let fileBuffer = readFileProm(fullPath)
          let exifData = ExifReader.load(fileBuffer, {domParser: new DOMParser({onError: onErrorStopParsing})})
          let imageObject = {
            name: file.name,
            fullPath: fullPath,
            fileSizeMB: (fileInfo.size / bitMByteMultiplayer).toFixed(1),
            exifData: exifData,
            fileBuffer: fileBuffer
          }
          //folderContentsFull.push(imageObject)
          return imageObject
        } catch { return null }
      }
    })
  )
}

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

async function getOneImage(path) {
  try {
    let fileBuffer = await readFileProm(fullPath)
    let exifData = await ExifReader.load(fileBuffer, {domParser: new DOMParser({onError: onErrorStopParsing}), async: true})
    return { fileBuffer: fileBuffer, exifData: exifData }
  } catch (e) {
    console.log(e)
    return null
  }
}

async function getOneImageExif(path) {
  try {
    let fileBuffer = await readFileProm(path)
    let exifData = await ExifReader.load(fileBuffer, {domParser: new DOMParser({onError: onErrorStopParsing}), async: true})

    return { exifData: exifData, jpegThumbnail:  }
  } catch (e) {
    console.log(e)
    return null
  }
}

async function getImagesExifParallel(files) {
  try {
    //let exifList = await async.each(files, getOneImageExif)
    //let exifList = await getOneImageExif(files[0])
    const chunkSize = 40
    const chunkList = [...chunks(files, chunkSize)]
    let exifList = []

    for (const chunk of chunkList) {
      let exifChunk = await Promise.all(chunk.map(async file => {
        console.log('Done file: ' + file)
        return await getOneImageExif(file)
      }))
      exifList.push(...exifChunk)
    }
    
    return exifList
  } catch (e) {
    console.log(e)
    return null
  }
}

async function handleReadFolder(event, path) {
  const folderContents = fs.readdirSync(path, { withFileTypes: true })
  let imageList = await getImagesExifParallel(folderContents.map((file) => file.path + '\\' + file.name))
  console.log(imageList)
  return imageList
}

/*
async function handleReadFolder(event, path) {
    //const startTime = performance.now()
  const folderContents = fs.readdirSync(path, { withFileTypes: true })
    //console.log("File Count: " + folderContents.length)
  let folderContentsFull = []
  folderContents.forEach((file, idx) => {
    let fullPath = file.path + '\\' + file.name
    let fileInfo = fs.statSync(fullPath)
    if (fileInfo.size < bitMByteMultiplayer * maxFileSizeMB) {
        //if (idx % 100 == 0) console.log(`Getting file ${idx} of ${folderContents.length}: ${fullPath}`)
      //try {
        //let fileBuffer = fs.readFileSync(fullPath)
        //let exifData = ExifReader.load(fileBuffer, {domParser: new DOMParser({onError: onErrorStopParsing})})
        let imageObject = {
          name: file.name,
          fullPath: fullPath,
          fileSizeMB: (fileInfo.size / bitMByteMultiplayer).toFixed(1)
          //exifData: exifData,
          //fileBuffer: fileBuffer
        }
        folderContentsFull.push(imageObject)
      //} catch {}
    }
  })
    //const endTime = performance.now()
    //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
  return folderContentsFull
}
*/

async function handleGetImage(event, path) {
  try {
    if (fs.existsSync(path)) {
      let fileBuffer = await readFileProm(path)
      let exifData = await ExifReader.load(fileBuffer, {domParser: new DOMParser({onError: onErrorStopParsing})})
      return { filePath: path, exifData: exifData, fileBuffer: fileBuffer }
    } else { throw "File doesn't exist!!" }
  } catch (e) {
    console.log(e)
    return "File unavailable or not an image!!"
  }
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
  ipcMain.handle('files:getImage', handleGetImage)
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
