'use strict'

const { emptyDir, outputFile } = require('fs-extra')
const timeSpan = require('time-span')
const { promisify } = require('util')
const getHTML = require('html-get')
const { size } = require('lodash')
const aigle = require('aigle')
const mitt = require('mitt')

const countFiles = promisify(require('count-files'))

const bundleFile = require('./bundle-file')
const normalize = require('./normalize')
const getUrls = require('./get-urls')

const RE_LAST_TRAILING_SLASH = /\/$/

const getFileName = ({ pathname }) => {
  const filename =
    pathname === '/' ? 'index' : pathname.replace(RE_LAST_TRAILING_SLASH, '')
  return `${filename}.html`
}

const bundler = async (
  url,
  { total, cache, emitter, output, prerender, ...opts }
) => {
  const { html: originalHtml } = await getHTML(url, { prerender })
  const { urls, html } = await normalize({ html: originalHtml, url, opts })
  const downloader = bundleFile({ cache, output, emitter })
  const filename = getFileName(new URL(url))
  let time = timeSpan()
  await aigle.each(urls, downloader)
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
  await aigle.eachLimit(urls, concurrence, url =>
    bundler(url, { total, cache, emitter, output, ...opts })
  )
  time = time()
  const { files, bytes } = await countFiles(output)
  emitter.emit('end', { urls: Array.from(cache), files, bytes, time })
}

module.exports = (
  targetUrls,
  { output, cache = new Set(), emitter = mitt(), ...opts }
) => {
  getUrls(targetUrls)
    .then(urls => bundle(urls, { output, emitter, cache, ...opts }))
    .catch(error => emitter.emit('error', error))

  return emitter
}
