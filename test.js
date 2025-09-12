//const path = "C:\\Users\\plazm\\Pictures\\2ndRoll!\\000059710001.jpg"
//console.log( path.split(".").slice(0, -1).join("") + "-thumb.jpg" )
import { ExifTool } from "exiftool-vendored"
const exiftool = new ExifTool({})

import { promisify } from "node:util"
import { exec as execCB } from "node:child_process"
const exec = promisify(execCB)

/*
await exiftool.write("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797-thumb.jpg", { Orientation: 'Rotate 270 CW' })

let verticalNef = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797.NEF")
let horizontalJpg = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2782-thumb.jpg")
let horizontalNef = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2782.NEF")
let verticalJpg = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797-thumb.jpg")

console.log(`VertNef: ${verticalNef.Orientation} \n HorizNef: ${horizontalNef.Orientation} \n VertJpg: ${verticalJpg.Orientation} \n HorizJpg: ${horizontalJpg.Orientation}`)
*/

//let fullImage = await exiftool.extractJpgFromRaw("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797.NEF", "C:\\Users\\plazm\\Pictures\\testNEF\\Z50ii.jpg")
//let fullImage2 = await exiftool.extractJpgFromRaw("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2529.NEF", "C:\\Users\\plazm\\Pictures\\testNEF\\Z5.jpg")
//let fullImage3 = await exiftool.extractJpgFromRaw("C:\\Users\\plazm\\Pictures\\testNEF\\DSC02027.ARW", "C:\\Users\\plazm\\Pictures\\testNEF\\A7C.jpg")

//let arw = "C:\\Users\\plazm\\Pictures\\testNEF\\DSC02027.ARW"
let arw = "C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797.NEF"

async function getFullImage(thispath) {
  try {
    let outpath = thispath.split(".").slice(0, -1).join("") + "-full.jpg"
    let { error, stdout, stderr } = await exec(`magick ${ thispath } -auto-orient -quality 95 ${ outpath }`)
    if (fs.existsSync(outpath)) {
      return await readFilePr(thumbnailpath, {encoding: 'base64'})
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

let out = await getFullImage(arw)