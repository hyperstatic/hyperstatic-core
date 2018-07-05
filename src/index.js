'use strict'

const { emptyDir, outputFile } = require('fs-extra')

const timeSpan = require('time-span')

const { promisify } = require('util')
const getHTML = require('html-get')
const aigle = require('aigle')
const mitt = require('mitt')

const countFiles = promisify(require('count-files'))

const getUrls = require('./get-urls')
const bundleFile = require('./file')
const normalize = require('./normalize')

const RE_LAST_TRAILING_SLASH = /\/$/

const getFileName = ({ pathname }) => {
  const filename =
    pathname === '/' ? 'index' : pathname.replace(RE_LAST_TRAILING_SLASH, '')

  return `${filename}.html`
}

const getContent = async ({ html, url, ...opts }) => {
  const { html: bundleHtml, urls: bundleUrls } = await normalize({
    html,
    url,
    ...opts
  })

  const { urls: originalUrls } = await normalize({
    html,
    url,
    absoluteUrls: true,
    ...opts
  })

  const urls = originalUrls.map((originalUrl, index) => ({
    originalUrl,
    bundleUrl: bundleUrls[index]
  }))

  return { html: bundleHtml, urls }
}

const bundler = async (url, { cache, emitter, output, prerender, ...opts }) => {
  const { html: originalHtml } = await getHTML(url, { prerender })
  const { urls, html } = await getContent({ html: originalHtml, url, opts })
  const downloader = bundleFile({ cache, output, emitter })
  const filename = getFileName(new URL(url))
  emitter.emit('url', { url, filename })
  await aigle.each(urls, downloader)
  await outputFile(`${output}/${filename}`, html)
  console.log()
}

const bundle = async (
  urls,
  { concurrence, emitter, cache, output, ...opts }
) => {
  await emptyDir(output)
  let time = timeSpan()
  await aigle.eachLimit(urls, concurrence, url =>
    bundler(url, { cache, emitter, output, ...opts })
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
