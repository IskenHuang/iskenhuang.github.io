var FS = require('fs')

// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
const templateItem = '<h3><a href="/' + labFolderName + '/{{name}}">{{name}}</a></h3>'
const templateName = 'template.html'
const indexName = 'index.html'
const labFolder = FS.readdirSync(labFolderName)
var labs = []
var bodyTemplate = '<style>h3 {padding: 0.8rem 0;} h3:nth-child(2n) { background-color: #fafafa;}</style><div class="cell-inner row borderbox">'

const normalHtml = FS.readFileSync(templateName).toString()
var result = ''

labFolder.map(function(item) {
    if(item.indexOf('.') < 0) {
        const _name = [labFolderName, item, indexName].join('/')
        const hasIndex = FS.readFileSync(_name)
        if(hasIndex) {
            bodyTemplate += templateItem.replace(/\{\{name\}\}/g, item)
            labs.push(item)
        }
    }
})

bodyTemplate += '</div>'

result = normalHtml.replace(/\{\{title\}\}/g, labName)
                        .replace(/\{\{body\}\}/g, bodyTemplate)

FS.writeFileSync([labFolderName, indexName].join('/'), result)
