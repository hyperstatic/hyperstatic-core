'use strict'

const { extname } = require('path')

const clearQueryString = require('./clear-query-string')

const getBundleUrl = url => {
  const { pathname, search, hostname } = new URL(url)
  const baseUrl = `${pathname}${search}`
  return `/${hostname}${baseUrl}`
}

module.exports = url => {
  const pathname = getBundleUrl(url)
  return { url, pathname, extension: extname(clearQueryString(pathname)) }
}
