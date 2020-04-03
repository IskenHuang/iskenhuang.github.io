var FS = require('fs')

// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
const templateItem = `<h3><a href="/${labFolderName}/{{name}}">{{name}}</a></h3>`
const templateName = `${__dirname}/template.html`
const indexName = 'index.html'
const labFolder = FS.readdirSync(labFolderName)
var labs = []
var bodyTemplate = removeLineBreak(`
<style>
    h3 {padding: 1.5vw 2vw; box-sizing: border-box; margin: 0; }
    h3:nth-child(2n) { background-color: #eee; }
    @media (prefers-color-scheme: dark) {
        h3:nth-child(2n) { background-color: #666; }
    }
</style>
<div class="row fd-col">
`)

const normalHtml = FS.readFileSync(templateName).toString()
const commonCss = removeLineBreak(FS.readFileSync(`${__dirname}/../common.css`).toString())
var result = ''

labFolder.map(function(item) {
    if(item.indexOf('.') < 0 && !item.match(/^_/)) {
        const _name = [labFolderName, item, indexName].join('/')
        console.log('item = ', item)
        const hasIndex = FS.readFileSync(_name)
        if(hasIndex) {
            bodyTemplate += templateItem.replace(/\{\{name\}\}/g, item)
            labs.push(item)
        }
    }
})

bodyTemplate += '</div>'

result = normalHtml.replace(/\{\{title\}\}/g, labName)
                        .replace(/\{\{commoncss\}\}/g, commonCss)
                        .replace(/\{\{body\}\}/g, bodyTemplate)

FS.writeFileSync([labFolderName, indexName].join('/'), result)

console.log('build success')

// -------------------------------------
function removeLineBreak(s) {
    return s.replace(/\n/g, '')
}