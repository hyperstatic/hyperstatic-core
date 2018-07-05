'use strict'

const { outputFile } = require('fs-extra')

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

const createBundleUrls = ({
  cache,
  emitter,
  concurrence,
  output,
  prerender,
  ...opts
}) => async url => {
  const { html: originalHtml } = await getHTML(url, { prerender })
  const { urls, html } = await getContent({ html: originalHtml, url, opts })
  const downloader = bundleFile({ cache, output, emitter })
  const filename = getFileName(new URL(url))
  emitter.emit('url', { url, filename })
  await aigle.eachLimit(urls, concurrence, downloader)
  await outputFile(`${output}/${filename}`, html)
  console.log()
}

module.exports = (targetUrls, opts) => {
  const cache = new Set()
  const emitter = mitt()
  const bundleUrls = createBundleUrls({ cache, emitter, ...opts })
  let time = timeSpan()

  getUrls(targetUrls)
    .then(urls => aigle.eachSeries(urls, bundleUrls))
    .then(() => {
      time = time()
    })
    .then(() => countFiles(opts.output))
    .then(({ files, bytes }) => {
      emitter.emit('end', { files, bytes, time })
    })

  return emitter
}
