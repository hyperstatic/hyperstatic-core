'use strict'

const debug = require('debug')('hyperstatic:normalize')
const { normalizeUrl } = require('@metascraper/helpers')
const { TAGS } = require('html-urls')
const { reduce } = require('lodash')

const isFileUrl = require('./is-file-url')
const VinylUrl = require('./vinyl-url')

/**
 * Detects URLs from the HTML Tags markup and
 * rewrite them into bundle-friendly URLs
 */
module.exports = ({ $, url }) => {
  const vinylUrls = reduce(
    TAGS,
    (acc, htmlTags, propName) => {
      $(htmlTags.join(',')).each(function () {
        const el = $(this)
        const attr = el.attr(propName)
        if (isFileUrl(attr)) {
          const assetUrl = normalizeUrl(url, attr)
          const vinylUrl = VinylUrl(assetUrl)
          debug(assetUrl, '→', vinylUrl.pathname)
          el.attr(propName, `${vinylUrl.pathname}${vinylUrl.search}`)
          acc.push(vinylUrl)
        }
      })

      return acc
    },
    []
  )

  return { html: $.html(), vinylUrls }
}
