var FS = require('fs')

// create lab index
const labFolderName = 'lab'
const labName = 'Lab index'
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
            bodyTemplate += `<h3><a href="/${labFolderName}/${item}">${item}</a></h3>`
            labs.push(item)
        }
    }
})

result = liteTemplate(normalHtml, {
    title: labName,
    commoncss: commonCss,
    body: `${bodyTemplate}</div>`
})

FS.writeFileSync([labFolderName, indexName].join('/'), result)

console.log('build success')

// -----------------------------------------------------------
function removeLineBreak(s) {
    return s.replace(/\n|\ \ \ \ /g, '')
}

function liteTemplate(template, obj, options) {
    template += '';
    options = options || {};
    obj = Object.prototype.toString.call(obj) === '[object Object]' ? obj : {};

    var open = options.open || '{{',
        close = options.close || '}}',
        isEncode = !!options.isEncode,
        reg = new RegExp(getSyntax(open) + '\\ *\\w*\\ *' + getSyntax(close), 'g'),
        matchString = template.match(reg);

    function getString(v) {
        var _type = Object.prototype.toString.call(v),
            result = '';
        _type = _type.substring(8, _type.length-1).toLowerCase();

        switch(_type) {
            case 'string':
                result = v;
                break;
            case 'number':
                result = v + '';
                break;
            case 'object':
            case 'array':
                result = JSON.stringify(v);
                break;
        }

        return result;
    }

    function getSyntax(s) {
        return s.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\#/g, '\\#');
    }

    if(matchString) {
        for(var i = 0; i < matchString.length; i++) {
            var ms = matchString[i],
                key = ms.replace(open, '').replace(close, '').trim(),
                val = isEncode ? getString(obj[key]).replace(/\>/g, '&gt;').replace(/\</g, '&lt;') : getString(obj[key]),
                _regex = new RegExp(getSyntax(ms), 'g');

            template = template.replace(_regex, val);
        }
    }

    return template;
}
