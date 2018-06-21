'use strict'

const cheerio = require('cheerio')

module.exports = html =>
  cheerio.load(html, {
    lowerCaseTags: true,
    decodeEntities: true,
    lowerCaseAttributeNames: true
  })
