'use strict'

const parseDomain = require('parse-domain')
const { filter, some } = require('lodash')
const isFile = require('check-file')
const { reduce } = require('aigle')
const cssUrls = require('css-urls')

const clearQueryString = require('./clear-query-string')
const VinylUrl = require('./vinyl-url')

const BLACKLIST_URLS = [{ domain: 'now', tld: 'sh' }]

const isBlacklist = url =>
  some(BLACKLIST_URLS, blacklistUrl => {
    const parsedUrl = parseDomain(url) || {}
    return (
      blacklistUrl.tld === parsedUrl.tld &&
      blacklistUrl.domain === parsedUrl.domain
    )
  })

const isFileUrl = url => !isBlacklist(url) && isFile(url)

module.exports = async vinylUrls => {
  // Remove non file urls
  const vinylFilesUrls = filter(vinylUrls, ({ url }) =>
    isFileUrl(clearQueryString(url))
  )

  // follow stylesheets urls for extracting urls inside css
  // TODO: Parallel?
  const urls = await reduce(
    vinylFilesUrls,
    async (set, { url, extension }) => {
      if (!cssUrls.isCss(url)) return set
      const urls = await cssUrls(url)
      return new Set([...set, ...urls.map(VinylUrl)])
    },
    new Set(vinylFilesUrls)
  )

  return Array.from(urls)
}
