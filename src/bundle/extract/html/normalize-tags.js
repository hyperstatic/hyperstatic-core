'use strict'

const debug = require('debug')('hyperstatic:normalize')
const debugError = require('debug')('hyperstatic:normalize:error')
const { getUrl } = require('@metascraper/helpers')
const { reduce } = require('lodash')
const { TAGS } = require('html-urls')

const isFileUrl = require('../is-file-url')
const VinylUrl = require('../vinyl-url')

module.exports = ($, url) => {
  const vinylUrls = reduce(
    TAGS,
    (acc, htmlTags, propName) => {
      $(htmlTags.join(',')).each(function () {
        const el = $(this)
        const attr = el.attr(propName)
        if (isFileUrl(attr)) {
          try {
            const resourceUrl = getUrl(url, attr)
            const vinylUrl = VinylUrl(resourceUrl)
            debug(resourceUrl, '→', vinylUrl.pathname)
            el.attr(propName, vinylUrl.pathname)
            acc.push(vinylUrl)
          } catch (err) {
            debugError(attr, '→', err.message || err)
          }
        }
      })

      return acc
    },
    []
  )

  return { html: $.html(), vinylUrls }
}
