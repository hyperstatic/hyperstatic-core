'use strict'

const cheerio = require('cheerio')

const normalizeTags = require('./normalize-tags')

const loadHTML = html =>
  cheerio.load(html, {
    xmlMode: false,
    lowerCaseTags: true,
    decodeEntities: true,
    lowerCaseAttributeNames: true
  })

module.exports = ({ html, url }) => {
  const $ = loadHTML(html)
  // NOTE: normalizeTags mutates `html`
  const vinylUrls = normalizeTags($, url)
  return { html: $.html(), vinylUrls }
}
