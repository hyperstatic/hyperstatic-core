'use strict'

const load = require('./load')
const normalizeUrls = require('./normalize-urls')

module.exports = ({ html, url }) => {
  const $ = load(html)
  normalizeUrls($, url)
  return $.html()
}
