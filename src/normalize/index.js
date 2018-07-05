'use strict'

const normalizeHtml = require('./html')
const normalizeUrls = require('./urls')

module.exports = async ({ html: rawHtml, url, ...opts }) => {
  const html = await normalizeHtml({ html: rawHtml, url, ...opts })
  const urls = await normalizeUrls({ html, url, ...opts })
  return { html, urls }
}
