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
  // NOTE: normalizeTags mutates `html`
  // TODO: `normalizeHttp` should be default false into `getUrl` from metascraper
  const vinylUrls = normalizeTags($, url, { normalizeHttp, ...opts })
  return { html: $.html(), vinylUrls }
}
