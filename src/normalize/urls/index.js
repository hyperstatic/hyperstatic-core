'use strict'

const isFileUrl = require('check-file')
const htmlUrls = require('html-urls')

module.exports = async ({ html, url }) => {
  const extractedUrls = await htmlUrls({ html, url })
  return extractedUrls.map(item => item.normalizedUrl).filter(isFileUrl)
}
