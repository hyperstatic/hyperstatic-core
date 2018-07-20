'use strict'

const parseDomain = require('parse-domain')
const isFileUrl = require('check-file')
const htmlUrls = require('html-urls')
const { some, chain } = require('lodash')

const BLACKLIST_URLS = [{ domain: 'now', tld: 'sh' }]

const isFile = url => {
  const isBlackListedUrl = some(BLACKLIST_URLS, blacklistUrl => {
    const parsedUrl = parseDomain(url) || {}
    return (
      blacklistUrl.tld === parsedUrl.tld &&
      blacklistUrl.domain === parsedUrl.domain
    )
  })

  return !isBlackListedUrl && isFileUrl(url)
}

module.exports = async ({ html, url, ...opts }) =>
  chain(await htmlUrls({ html, url, ...opts }))
    .map('normalizedUrl')
    .filter(isFile)
    .value()
