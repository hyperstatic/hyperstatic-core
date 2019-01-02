'use strict'

const { isEmpty, forEach, get } = require('lodash')
const { outputFile } = require('fs-extra')
const download = require('download')
const path = require('path')

module.exports = ({ output, emitter, cache, rewrite }) => async ({
  extension,
  url,
  pathname
}) => {
  if (isEmpty(pathname) || cache.has(url)) {
    emitter.emit('file:skipped', { pathname })
    return
  }

  const filepath = path.join(output, pathname)

  try {
    let data = await download(url)
    const rewriter = get(rewrite, url)

    if (rewriter) {
      forEach(rewriter, ({ url, originalUrl }) => {
        const regex = new RegExp(originalUrl, 'gi')
        data = data.toString().replace(regex, url)
      })
    }

    await outputFile(filepath, data)
    emitter.emit('file:created', { url, pathname })
  } catch (err) {
    await outputFile(filepath, '')
    emitter.emit('file:error', { url, pathname, err })
  }

  cache.add(url)
}
