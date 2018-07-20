'use strict'

const extractHtml = require('./html')
const extractUrls = require('./urls')

module.exports = async opts => {
  // // TODO: Normalize CSS
  const html = await extractHtml(opts)
  // // TODO: Add URLs from CSS
  const [bundleUrls, originalUrls] = await Promise.all([
    extractUrls(opts),
    extractUrls({ ...opts, html })
  ])

  const urls = originalUrls.map((originalUrl, index) => ({
    originalUrl,
    bundleUrl: bundleUrls[index]
  }))

  return { html, urls }
}
