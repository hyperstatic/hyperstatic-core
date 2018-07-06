'use strict'

const debug = require('debug')('hyperstatic:normalize')
const { getUrl } = require('@metascraper/helpers')
const { forEach, isNil } = require('lodash')
const parseDomain = require('parse-domain')
const { TAGS } = require('html-urls')
const url = require('url')

const { URL } = url

const getBundleUrl = (targetUrl, { absoluteUrls }) => {
  if (absoluteUrls) return targetUrl
  const { pathname, search } = new URL(targetUrl)
  const { subdomain } = parseDomain(targetUrl)
  const baseUrl = `${pathname}${search}`
  return subdomain ? `${subdomain}${baseUrl}` : baseUrl
}

module.exports = ($, url, { absoluteUrls, ...opts }) =>
  forEach(TAGS, (htmlTags, propName) =>
    $(htmlTags.join(',')).each(function () {
      const el = $(this)
      const attr = el.attr(propName)
      if (!isNil(attr)) {
        try {
          const resourceUrl = getUrl(url, attr, opts)
          const newAttr = getBundleUrl(resourceUrl, { absoluteUrls })
          debug(attr, '→', newAttr)
          el.attr(propName, newAttr)
        } catch (err) {
          debug(attr, '→', err.message || err)
        }
      }
    })
  )
