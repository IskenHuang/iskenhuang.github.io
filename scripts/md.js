import showdown from 'showdown'
import fs from 'node:fs'
import path from 'node:path'
import { isDir, __dirProjectHome, getTemplateHtml } from './utils.js'

let TOTAL_BLOG_COUNT = 0

async function findMd(rootPath) {
    // console.log('findMd = ', rootPath)
    try {
        const fileList = fs.readdirSync(rootPath)
        for (let file of fileList) {
            const fullPath = `${rootPath}/${file}`
            if (isDir(fullPath)) {
                await findMd(fullPath)
            } else {
                const mdRegex = /\.md$/
                if (file.match(mdRegex)) {
                    // console.log('md file = ', file, fullPath)
                    const stat = fs.statSync(fullPath)
                    // console.log('md file2 = ', stat)
                    const mdStr = fs.readFileSync(fullPath)?.toString().replace(/---/, () => {
                        return `create at ${(new Date(stat.birthtimeMs)).toISOString()}\n\n---`
                    })
                    if (mdStr) {
                        const html = md2html(mdStr)
                        // console.log('html = ', html.length)
                        const title = file.replace(mdRegex, '')
                        const newFile = getTemplateHtml({
                            title,
                            style: `<link rel="stylesheet" href="/md.min.css">`,
                            body: html,
                        })

                        const writeFolderPath = `${rootPath}/${encodeURIComponent(title)}`
                        if (!fs.existsSync(writeFolderPath)) {
                            fs.mkdirSync(writeFolderPath, { recursive: true });
                        }

                        fs.writeFileSync(`${writeFolderPath}/index.html`, newFile)
                        TOTAL_BLOG_COUNT++
                    }
                }
            }
        }
    }catch(e) {
        console.log('e = ', e)
    }
}

function md2html(file) {
    const converter = new showdown.Converter({
        literalMidWordUnderscores: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        tasklists: true,
        underline: true,
    })
    const html = converter.makeHtml(file)
    return html
}

export default async () => {
    console.log('blog md to html process start')
    await findMd(path.join(__dirProjectHome(), '/blog'))
    console.log(`blog md to html DONE. Total ${TOTAL_BLOG_COUNT}`)
}
