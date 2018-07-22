'use strict'

const parseDomain = require('parse-domain')
const { isMatch, isObject, memoize, isNil, find } = require('lodash')
const isFile = require('check-file')
const debug = require('debug')('hyperstatic:is-file-url')

const WHITELIST_URLS = [
  { domain: 'vimeo', subdomain: 'player' },
  { domain: 'spotify', subdomain: 'open' }
]

const clearQueryString = require('./clear-query-string')

const BLACKLIST_URLS = [
  { domain: 'now', tld: 'sh' }
]

const findUrl = (collection, urlObj) => find(collection, (urlObj2) => isMatch(urlObj, urlObj2))

const parseUrl = url => parseDomain(url) || {}

const isWhiteList = url => {
  const urlObj = parseUrl(url)
  const whitelistUrl = findUrl(WHITELIST_URLS, urlObj)
  return !isNil(whitelistUrl)
}

const isBlackList = url => {
  const urlObj = parseUrl(url)
  const blacklistUrl = findUrl(BLACKLIST_URLS, urlObj)
  return isObject(blacklistUrl)
}

const isFileUrl = input => {
  const url = clearQueryString(input)
  const is = isBlackList(url) ? false : isWhiteList(url) || isFile(url)
  debug(`${url} → ${is}`)
  return is
}

module.exports = memoize(isFileUrl)
