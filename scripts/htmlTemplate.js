const FS = require('fs')
const liteTemplate = require('./lifeTemplate')
const { removeLineBreak } = require('./utils')

const baseHtml = FS.readFileSync(`${__dirname}/template.html`).toString()
const commonCss = removeLineBreak(FS.readFileSync(`${__dirname}/../common.min.css`).toString())

module.exports = function (obj) {
    return liteTemplate(baseHtml, Object.assign({
        commoncss: commonCss,
    }, obj))
}