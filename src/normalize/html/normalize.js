'use strict'

const debug = require('debug')('hyperstatic:normalize')
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
        try {
          const resourceUrl = getUrl(url, attr)
          const { pathname, search } = new URL(resourceUrl)
          const newAttr = absoluteUrls ? resourceUrl : `${pathname}${search}`
          debug(attr, '→', newAttr)
          el.attr(propName, newAttr)
        } catch (err) {
          debug(attr, '→', err.message || err)
        }
      }
    })
  )
