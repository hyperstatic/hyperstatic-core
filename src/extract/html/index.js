'use strict'

const cheerio = require('cheerio')

const normalizeTags = require('./normalize-tags')

const loadHTML = (html, { xmlMode }) =>
  cheerio.load(html, {
    xmlMode,
    lowerCaseTags: true,
    decodeEntities: true,
    lowerCaseAttributeNames: true
  })

module.exports = ({
  html,
  url,
  normalizeHttp = true,
  xmlMode = false,
  ...opts
}) => {
  const $ = loadHTML(html, { xmlMode, ...opts })
  normalizeTags($, url, { normalizeHttp, ...opts })
  // TODO: Normalize CSS
  return $.html()
}
