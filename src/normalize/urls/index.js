'use strict'

const parseDomain = require('parse-domain')
const isFileUrl = require('check-file')
const { some } = require('lodash')
const htmlUrls = require('html-urls')

const BLACKLIST_URLS = [{ tld: 'sh', domain: 'now' }]

const isFile = url => {
  const isBlackListedUrl = some(BLACKLIST_URLS, blacklistUrl => {
    const parsedUrl = parseDomain(url)
    return (
      blacklistUrl.tld === parsedUrl.tld &&
      blacklistUrl.domain === parsedUrl.domain
    )
  })
  return !isBlackListedUrl && isFileUrl(url)
}

module.exports = async ({ html, url }) => {
  const extractedUrls = await htmlUrls({ html, url })
  return extractedUrls.map(item => item.normalizedUrl).filter(isFile)
}
