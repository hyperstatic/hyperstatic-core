'use strict'

const debug = require('debug')('hyperstatic:normalize')
const debugError = require('debug')('hyperstatic:normalize:error')
const { getUrl } = require('@metascraper/helpers')
const { forEach, isNil } = require('lodash')
const { TAGS } = require('html-urls')
const url = require('url')

const { URL } = url

const getBundleUrl = (url, attr) => {
  const { pathname, search, hostname } = new URL(attr)
  const baseUrl = `${pathname}${search}`
  return `/${hostname}${baseUrl}`
}

module.exports = ($, url, opts) =>
  forEach(TAGS, (htmlTags, propName) =>
    $(htmlTags.join(',')).each(function () {
      const el = $(this)
      const attr = el.attr(propName)
      if (!isNil(attr)) {
        try {
          const resourceUrl = getUrl(url, attr, opts)
          const newAttr = getBundleUrl(url, resourceUrl)
          debug(resourceUrl, '→', newAttr)
          el.attr(propName, newAttr)
        } catch (err) {
          debugError(attr, '→', err.message || err)
        }
      }
    })
  )
