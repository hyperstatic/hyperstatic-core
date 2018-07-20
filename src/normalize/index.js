'use strict'

const normalizeHtml = require('./html')
const normalizeUrls = require('./urls')

module.exports = async ({ html: rawHtml, url, ...opts }) => {
  const bundleHtml = await normalizeHtml({ html: rawHtml, url, ...opts })

  const [bundleUrls, originalUrls] = await Promise.all([
    normalizeUrls({ html: bundleHtml, url, ...opts }),
    normalizeUrls({ html: rawHtml, url, ...opts })
  ])

  const urls = originalUrls.map((originalUrl, index) => ({
    originalUrl,
    bundleUrl: bundleUrls[index]
  }))
  return { html: bundleHtml, urls }
}
