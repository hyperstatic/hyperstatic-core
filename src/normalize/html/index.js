'use strict'

const load = require('./load')
const normalize = require('./normalize')

module.exports = ({
  html,
  url,
  absoluteUrls = false,
  xmlMode = false,
  ...opts
}) => {
  const $ = load(html, { xmlMode, ...opts })
  normalize($, url, { absoluteUrls, ...opts })
  return $.html()
}
