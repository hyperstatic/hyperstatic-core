'use strict'

const { emptyDir, outputFile } = require('fs-extra')
const timeSpan = require('time-span')
const getHTML = require('html-get')
const { size } = require('lodash')
const { URL } = require('url')
const aigle = require('aigle')

const { promisify } = require('util')

const countFiles = promisify(require('count-files'))

const download = require('./download')
const extract = require('./extract')

const RE_LAST_TRAILING_SLASH = /\/$/

const getFileName = ({ pathname }) => {
  const filename =
    pathname === '/' ? 'index' : pathname.replace(RE_LAST_TRAILING_SLASH, '')
  return `${filename}.html`
}

const bundle = async (url, { total, cache, emitter, output, prerender }) => {
  const { html: originalHtml } = await getHTML(url, { prerender })
  const { urls, html, rewrite } = await extract({ html: originalHtml, url })
  const downloader = download({ cache, output, emitter, rewrite })
  const filename = getFileName(new URL(url))
  let time = timeSpan()
  await aigle.each(urls, downloader)
  await outputFile(`${output}/${filename}`, html)
  time = time()
  emitter.emit('url', { url, filename, time, total })
}

module.exports = async (
  urls,
  { concurrence, emitter, cache, output, ...opts }
) => {
  await emptyDir(output)
  const total = size(urls)
  let time = timeSpan()
  await aigle.eachLimit(urls, concurrence, url =>
    bundle(url, { total, cache, emitter, output, ...opts })
  )
  time = time()
  const { files, bytes } = await countFiles(output)
  emitter.emit('end', { urls: Array.from(cache), files, bytes, time })
}
