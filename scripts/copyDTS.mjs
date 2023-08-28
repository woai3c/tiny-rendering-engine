import { readFileSync, readdirSync, appendFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const files = readdirSync(getFilePath('../types'))
let code = ''
files.forEach((file) => {
    code += '\n' + readFileSync(getFilePath(`../types/${file}`)) + '\n'
})

appendFileSync(getFilePath('../dist/index.d.ts'), code)

function getFilePath(name) {
    return resolve(__dirname, name)
}
