import * as fs from "fs"

export function logToFile(data: Buffer | string, filenameSuffix?: string) {
    let filename = new Date().toISOString().replace(/:/g, '-')
    if(filenameSuffix) {
        filename = `${filename}.${filenameSuffix}`
    }
    const filePath = `logs/${filename}.log`
    fs.writeFile(filePath, data, (err) => {
        if (err) throw err
        console.log(`${new Date().toISOString()}: logged to ${filePath}`)
    })
}
