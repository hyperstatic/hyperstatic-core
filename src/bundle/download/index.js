'use strict'

const { outputFile } = require('fs-extra')
const { isEmpty } = require('lodash')
const download = require('download')
const path = require('path')

module.exports = ({ output, emitter, cache }) => async vinyUrl => {
  const { url, data, pathname } = vinyUrl

  if (isEmpty(pathname) || cache.has(url)) {
    return emitter.emit('file:skipped', { pathname })
  }

  const filepath = path.join(output, pathname)

  try {
    const content = data || (await download(url))
    await outputFile(filepath, content)
    emitter.emit('file:created', { url, pathname })
  } catch (err) {
    await outputFile(filepath, '')
    emitter.emit('file:error', { url, pathname, err })
  }
  cache.add(url)
}
