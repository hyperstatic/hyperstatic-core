'use strict'

const { getUrl } = require('@metascraper/helpers')
const { forEach, isNil } = require('lodash')
const { TAGS } = require('html-urls')

/**
 * It converts all URLs into absolute
 */
module.exports = ($, url) =>
  forEach(TAGS, (htmlTags, propName) =>
    $(htmlTags.join(',')).each(function () {
      const el = $(this)
      const attr = el.attr(propName)
      if (!isNil(attr)) el.attr(attr, getUrl(url, attr))
    })
  )
