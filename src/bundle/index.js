'use strict'

const { emptyDir, outputFile } = require('fs-extra')
const { each, eachLimit } = require('aigle')
const timeSpan = require('time-span')
const getHTML = require('html-get')
const { size } = require('lodash')
const { URL } = require('url')

const { promisify } = require('util')

const countFiles = promisify(require('count-files'))

const download = require('./download')
const rewrite = require('./rewrite')

const RE_LAST_TRAILING_SLASH = /\/$/

const getFileName = ({ pathname }) => {
  const filename =
    pathname === '/' ? 'index' : pathname.replace(RE_LAST_TRAILING_SLASH, '')
  return `${filename}.html`
}

const bundleUrl = async (url, { total, cache, emitter, output, prerender }) => {
  const { html: rawHtml } = await getHTML(url, { prerender })
  const { vinylUrls, html } = await rewrite({ html: rawHtml, url })

  const downloader = download({ cache, output, emitter })
  const filename = getFileName(new URL(url))
  let time = timeSpan()
  await each(vinylUrls, downloader)
  await outputFile(`${output}/${filename}`, html)
  time = time()
  emitter.emit('url', { url, filename, time, total })
}

const bundle = async (
  urls,
  { concurrence, emitter, cache, output, ...opts }
) => {
  await emptyDir(output)
  const total = size(urls)
  let time = timeSpan()
  await eachLimit(urls, concurrence, url =>
    bundleUrl(url, { total, cache, emitter, output, ...opts })
  )
  time = time()
  const { files, bytes } = await countFiles(output)
  emitter.emit('end', { urls: Array.from(cache), files, bytes, time })
}

module.exports = bundle
