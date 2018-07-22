'use strict'

const { html: fromHTML } = require('css-urls')
const { map } = require('lodash')

const VinylUrl = require('../vinyl-url')

module.exports = (url, rawHtml) => {
  const { html, urls } = fromHTML(url, rawHtml)
  const vinylUrls = map(urls, VinylUrl)
  return { html, vinylUrls }
}
