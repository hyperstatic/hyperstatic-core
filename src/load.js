'use strict'

const cheerio = require('cheerio')

module.exports = (html, { xmlMode }) =>
  cheerio.load(html, {
    xmlMode,
    lowerCaseTags: true,
    decodeEntities: true,
    lowerCaseAttributeNames: true
  })
