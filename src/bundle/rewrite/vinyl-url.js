'use strict'

const { extname } = require('path')
const { URL } = require('url')

const clearQueryString = require('./clear-query-string')

module.exports = (url, data) => {
  const { pathname, hostname, search } = new URL(url)

  return {
    url,
    data,
    search,
    pathname: `/${hostname}${pathname}`,
    extension: extname(clearQueryString(pathname))
  }
}
