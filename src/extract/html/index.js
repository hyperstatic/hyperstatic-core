'use strict'

const load = require('./load')
const normalize = require('./normalize')

module.exports = ({
  html,
  url,
  normalizeHttp = true,
  xmlMode = false,
  ...opts
}) => {
  const $ = load(html, { xmlMode, ...opts })
  normalize($, url, { normalizeHttp, ...opts })
  return $.html()
}
