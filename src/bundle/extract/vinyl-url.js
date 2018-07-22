'use strict'

const { extname } = require('path')

const clearQueryString = require('./clear-query-string')

const getBundleUrl = url => {
  const { pathname, hostname } = new URL(url)
  return `/${hostname}${pathname}`
}

module.exports = url => {
  const pathname = getBundleUrl(url)
  return { url, pathname, extension: extname(clearQueryString(pathname)) }
}
