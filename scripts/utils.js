import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url'

/**
 *
 * @param {String} s
 * @returns {String}
 */
export function removeLineBreak(s) {
    return s.replace(/\n|\ \ \ \ /g, '')
}

/**
 *
 * @returns {String}
 */
export function __filename() {
    return fileURLToPath(import.meta.url)
}

/**
 * currently file folder
 * @returns {String}
 */
export function __fileDirName() {
    return path.dirname(__filename())
}

/**
 * currently command folder
 * @returns {String}
 */
export function __dirname() {
    return process.cwd()
}

/**
 * currently command folder
 * @returns {String}
 */
export function __dirProjectHome() {
    return path.dirname(__fileDirName(), '/../')
}

export function isDir(path) {
    try {
        const s = fs.lstatSync(path)
        return s.isDirectory()
    } catch(e){}
    return false
}

/**
 *
 * @param {String} template
 * @param {Object} obj
 * @param {Object} options
 * @param {String} options.open
 * @param {String} options.close
 * @param {Boolean} options.isEncode
 * @returns {String}
 */
export function liteTemplate(template, obj, options) {
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

/**
 *
 * @returns {String}
 */
export function getTemplateBasic() {
    return fs.readFileSync(`${__dirProjectHome()}/scripts/template.html`).toString()
}

/**
 *
 * @param {Object} obj
 * @returns {String}
 */
export function getTemplateHtml(obj) {
    const commonCss = removeLineBreak(fs.readFileSync(`${__dirProjectHome()}/common.min.css`).toString())
    return liteTemplate(getTemplateBasic(), Object.assign({
        commoncss: commonCss,
    }, obj))
}
