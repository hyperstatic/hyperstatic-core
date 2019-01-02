'use strict'

const mitt = require('mitt')
const os = require('os')

const getUrls = require('./get-urls')
const bundle = require('./bundle')

module.exports = (
  targetUrls,
  {
    concurrence = os.cpus().length,
    output,
    cache = new Set(),
    emitter = mitt(),
    ...opts
  }
) => {
  getUrls(targetUrls, opts)
    .then(urls =>
      bundle(urls, { concurrence, output, emitter, cache, ...opts })
    )
    .catch(error => emitter.emit('error', error))

  return emitter
}
