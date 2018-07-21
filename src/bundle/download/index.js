'use strict'

const { outputFile } = require('fs-extra')
const download = require('download')
const cssUrls = require('css-urls')
const { URL } = require('url')
const path = require('path')

module.exports = ({ output, emitter, cache }) => async url => {
  const { originalUrl, bundleUrl } = url
  const { pathname } = new URL(bundleUrl)

  if (cache.has(bundleUrl)) {
    emitter.emit('file:skipped', { pathname })
    return
  }

  const filepath = path.join(output, pathname)
  let data = ''

  try {
    data = await download(originalUrl)
    if (cssUrls.isCss(originalUrl)) console.log('NEED TO REWRITE', originalUrl)
    await outputFile(filepath, data)
    emitter.emit('file:created', { pathname })
  } catch (err) {
    await outputFile(filepath, data)
    emitter.emit('file:error', { url: originalUrl, bundleUrl, pathname, err })
  }

  cache.add(bundleUrl)
}
