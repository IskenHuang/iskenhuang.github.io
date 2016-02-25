var FS = require('fs')

// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
const templateItem = '<h3><a href="/lab/{{name}}">{{name}}</a></h3>'
const templateName = 'template.html'
const labFolder = FS.readdirSync(labFolderName)
var labs = []
var bodyTemplate = '<div class="cell-inner">'

const normalHtml = FS.readFileSync(templateName).toString()
var result = ''

labFolder.map(function(item) {
    if(item.indexOf('.') < 0) {
        bodyTemplate += templateItem.replace(/\{\{name\}\}/g, item)
        labs.push(item)
    }
})

bodyTemplate += '</div>'

result = normalHtml.replace(/\{\{title\}\}/g, labName)
                        .replace(/\{\{body\}\}/g, bodyTemplate)

FS.writeFileSync('lab/index.html', result)
