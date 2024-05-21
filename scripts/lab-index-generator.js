const FS = require('fs')
const htmlTemplate = require('./htmlTemplate')
const removeLineBreak = require('./removeLineBreak')


// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
const indexName = 'index.html'
const labFolder = FS.readdirSync(labFolderName).filter(item => item.indexOf('.') < 0 && !item.match(/^_/))
const labs = []
const bodyPrefix = removeLineBreak(`
<style>
    h3 {padding: 1.5vw 2vw; box-sizing: border-box; margin: 0; }
    h3:nth-child(2n) { background-color: #f7f7f7; }
    @media (prefers-color-scheme: dark) {
        h3:nth-child(2n) { background-color: #666; }
    }
</style>
<div>
`)
let result = ''

// console.log('labFolder = ', labFolder)
labFolder.map(function(item) {
    const _name = [labFolderName, item, indexName].join('/')
    console.log('item = ', item)
    const hasIndex = FS.readFileSync(_name)
    if(hasIndex) {
        labs.push(`<h3><a href="/${labFolderName}/${item}/">${item}</a></h3>`)
    }
})

result = htmlTemplate({
    title: labName,
    body: `${bodyPrefix}${labs.join('')}</div>`
})

FS.writeFileSync([labFolderName, indexName].join('/'), result)

// TODO - update sw.js version
let sw = FS.readFileSync('./sw.js').toString()
let ver = parseInt(sw.match(/var VERSION = '\d+'/)[0].slice(15, -1), 10)
const swSplitLine = '// GENERATE_LINE_END'
const cacheUrls = [
    '/',
    '/favicon.ico?v=1.1',
    '/common.min.css',
    '/resume/',
    '/lab/',
].concat(labFolder.map(item => `/lab/${item}/`))

const swConfigScript = `// GENERATE_LINE_START
var APP_PREFIX = 'iskenme_'
var VERSION = '${++ver}'
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = ${JSON.stringify(cacheUrls, null, 4).replace(/"/g, '\'')}
${swSplitLine}`

sw = swConfigScript + sw.split(swSplitLine)[1]
// console.log('sw = ', sw)
FS.writeFileSync('./sw.js', sw)
console.log('sw.js version to ', ver)

console.log('build success')
