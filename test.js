//const path = "C:\\Users\\plazm\\Pictures\\2ndRoll!\\000059710001.jpg"
//console.log( path.split(".").slice(0, -1).join("") + "-thumb.jpg" )
import { ExifTool } from "exiftool-vendored"
const exiftool = new ExifTool({})
await exiftool.write("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797-thumb.jpg", { Orientation: 'Rotate 270 CW' })

let verticalNef = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797.NEF")
let horizontalJpg = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2782-thumb.jpg")
let horizontalNef = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2782.NEF")
let verticalJpg = await exiftool.read("C:\\Users\\plazm\\Pictures\\testNEF\\DSC_2797-thumb.jpg")

console.log(`VertNef: ${verticalNef.Orientation} \n HorizNef: ${horizontalNef.Orientation} \n VertJpg: ${verticalJpg.Orientation} \n HorizJpg: ${horizontalJpg.Orientation}`)