const FS = require('fs')
const htmlTemplate = require('./htmlTemplate')
const removeLineBreak = require('./removeLineBreak')


// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
const indexName = 'index.html'
const labFolder = FS.readdirSync(labFolderName)
const labs = []
const bodyPrefix = removeLineBreak(`
<style>
    h3 {padding: 1.5vw 2vw; box-sizing: border-box; margin: 0; }
    h3:nth-child(2n) { background-color: #eee; }
    @media (prefers-color-scheme: dark) {
        h3:nth-child(2n) { background-color: #666; }
    }
</style>
<div class="row fd-col">
`)
let result = ''

labFolder.map(function(item) {
    if(item.indexOf('.') < 0 && !item.match(/^_/)) {
        const _name = [labFolderName, item, indexName].join('/')
        console.log('item = ', item)
        const hasIndex = FS.readFileSync(_name)
        if(hasIndex) {
            labs.push(`<h3><a href="/${labFolderName}/${item}">${item}</a></h3>`)
        }
    }
})

result = htmlTemplate({
    title: labName,
    body: `${bodyPrefix}${labs.join('')}</div>`
})

FS.writeFileSync([labFolderName, indexName].join('/'), result)

console.log('build success')
