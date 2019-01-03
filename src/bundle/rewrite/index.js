'use strict'

const { map, merge } = require('lodash')

const rewriteHtml = require('./rewrite-html')
const rewriteCss = require('./rewrite-css')
const loadHTML = require('./load-html')

module.exports = async ({ url, html: rawHtml }) => {
  const $ = loadHTML(rawHtml)
  const { html: rewrittenHtml, vinylUrls: htmlVinylUrls } = rewriteHtml({
    $,
    url
  })

  const { html, vinylUrls: cssVinylUrls } = await rewriteCss({
    url,
    html: rewrittenHtml,
    urls: map(htmlVinylUrls, 'url')
  })

  const vinylUrls = merge(htmlVinylUrls, cssVinylUrls)

  return { html, vinylUrls }
}
