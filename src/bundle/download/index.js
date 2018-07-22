'use strict'

const { outputFile } = require('fs-extra')
const { forEach, get } = require('lodash')
const download = require('download')
const path = require('path')

module.exports = ({ output, emitter, cache, rewrite }) => async ({
  extension,
  url,
  pathname
}) => {
  if (cache.has(url)) {
    emitter.emit('file:skipped', { pathname })
    return
  }

  const filepath = path.join(output, pathname)
  let data = ''

  try {
    data = await download(url)
    const rewriter = get(rewrite, url)

    if (rewriter) {
      forEach(rewriter, ({ url, originalUrl }) => {
        const regex = new RegExp(originalUrl, 'gi')
        data = data.toString().replace(regex, url)
      })
    }

    await outputFile(filepath, data)
    emitter.emit('file:created', { pathname })
  } catch (err) {
    await outputFile(filepath, data)
    emitter.emit('file:error', { url, pathname, err })
  }

  cache.add(url)
}
