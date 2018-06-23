'use strict'

const debug = require('debug')('hyperstatic:normalize-urls')
const { getUrl } = require('@metascraper/helpers')
const { forEach, isNil } = require('lodash')
const { TAGS } = require('html-urls')
const { URL } = require('url')

module.exports = ($, url, { absoluteUrls }) =>
  forEach(TAGS, (htmlTags, propName) =>
    $(htmlTags.join(',')).each(function () {
      const el = $(this)
      const attr = el.attr(propName)
      if (!isNil(attr)) {
        const resourceUrl = getUrl(url, attr)
        const newAttr = absoluteUrls
          ? resourceUrl
          : new URL(resourceUrl).pathname
        debug(attr, '→', newAttr)
        el.attr(propName, newAttr)
      }
    })
  )
