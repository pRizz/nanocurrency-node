import * as fs from "fs"

export function logToFile(data: Buffer | string) {
    const filename = new Date().toISOString().replace(/:/g, '-')
    const filePath = `logs/${filename}.log`
    fs.writeFile(filePath, data, (err) => {
        if (err) throw err
        console.log(`${new Date().toISOString()}: logged to ${filePath}`)
    })
}
