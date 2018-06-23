'use strict'

const load = require('./load')
const normalizeUrls = require('./normalize-urls')

module.exports = ({ html, url, absoluteUrls = false, xmlMode = false }) => {
  const $ = load(html, { xmlMode })
  normalizeUrls($, url, { absoluteUrls })
  return $.html()
}
