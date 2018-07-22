'use strict'

const { reduce } = require('aigle')
const cssUrls = require('css-urls')

const clearQueryString = require('./clear-query-string')
const VinylUrl = require('./vinyl-url')

module.exports = async vinylUrls => {
  // follow stylesheets urls for extracting urls inside css
  const data = await reduce(
    vinylUrls,
    async (acc, { url, extension }) => {
      const { urls, meta } = await cssUrls(clearQueryString(url))
      acc.urls = new Set([...acc.urls, ...urls.map(VinylUrl)])
      acc.rewrite = { ...acc.rewrite, ...meta }
      return acc
    },
    { urls: new Set(vinylUrls), rewrite: {} }
  )

  return { ...data, urls: Array.from(data.urls) }
}
