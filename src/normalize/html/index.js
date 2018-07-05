'use strict'

const load = require('./load')
const normalize = require('./normalize')

module.exports = ({ html, url, absoluteUrls = false, xmlMode = false }) => {
  const $ = load(html, { xmlMode })
  normalize($, url, { absoluteUrls })
  return $.html()
}
