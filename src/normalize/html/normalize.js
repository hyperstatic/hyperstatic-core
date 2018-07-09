'use strict'

const debug = require('debug')('hyperstatic:normalize')
const { getUrl } = require('@metascraper/helpers')
const { forEach, isNil } = require('lodash')
const parseDomain = require('parse-domain')
const { TAGS } = require('html-urls')
const url = require('url')

const { URL } = url

const getBundleUrl = (url, resourceUrl) => {
  const { pathname, search } = new URL(resourceUrl)
  const { domain, subdomain } = parseDomain(resourceUrl)
  if (domain !== parseDomain(url).domain) return resourceUrl
  const baseUrl = `${pathname}${search}`
  return subdomain ? `/${subdomain}${baseUrl}` : baseUrl
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
          debug(attr, '→', newAttr)
          el.attr(propName, newAttr)
        } catch (err) {
          debug(attr, '→', err.message || err)
        }
      }
    })
  )
