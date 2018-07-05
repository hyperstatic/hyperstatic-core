'use strict'

const { outputFile } = require('fs-extra')
const download = require('download')
const { URL } = require('url')
const path = require('path')

module.exports = ({ output, emitter, cache }) => async url => {
  const { originalUrl, bundleUrl } = url
  // console.log(JSON.stringify(url, null, 2))
  const { pathname } = new URL(bundleUrl)

  if (cache.has(bundleUrl)) {
    emitter.emit('file:skipped', { pathname })
    return
  }

  const filepath = path.join(output, pathname)
  let data = ''

  try {
    data = await download(originalUrl)
    await outputFile(filepath, data)
    emitter.emit('file:created', { pathname })
  } catch (err) {
    await outputFile(filepath, data)
    emitter.emit('file:error', { pathname })
  }

  cache.add(bundleUrl)
}
