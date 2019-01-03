'use strict'

const { extension } = require('@metascraper/helpers')
const { map, reduce, filter } = require('lodash')
const cssUrls = require('css-urls')
const aigle = require('aigle')
const got = require('got')

const VinylUrl = require('./vinyl-url')

const isCssUrl = url => extension(url) === 'css'

const rewriteCss = async ({ url, text }) => {
  const items = cssUrls({ url, text })

  const replacers = reduce(
    items,
    (acc, { url, normalizedUrl }) => {
      const { pathname } = VinylUrl(normalizedUrl)
      const substr = new RegExp(url, 'gi')
      return [...acc, [substr, pathname]]
    },
    []
  )

  const data = reduce(
    replacers,
    (buffer, [substr, newSubstr]) => buffer.replace(substr, newSubstr),
    text
  )

  const vinyUrls = map(items, item => VinylUrl(item.normalizedUrl))

  return { data, vinyUrls: new Set([...vinyUrls]) }
}

const fromStylesheets = async urls => {
  const collection = filter(urls, isCssUrl)

  const iterator = async (set, url) => {
    const { body } = await got(url)
    const { data, vinyUrls } = await rewriteCss({ text: body, url })
    return new Set([...set, ...vinyUrls, VinylUrl(url, data)])
  }

  const vinyUrls = await aigle.reduce(collection, iterator, new Set())
  return Array.from(vinyUrls)
}

const fromInlineStyle = async ({ url, html }) => {
  const { data, vinyUrls } = await rewriteCss({ url, text: html })
  return { data, vinyUrls: Array.from(vinyUrls) }
}

/**
 * Get URLs inside HTML markup (inline) and also from stylesheets
 */
module.exports = async ({ url, html, urls }) => {
  const stylesheetsVinylUrls = await fromStylesheets(urls)
  const { data, vinyUrls: inlineVinyUrls } = await fromInlineStyle({
    url,
    html
  })

  return {
    html: data,
    vinylUrls: Array.from(new Set([...inlineVinyUrls, ...stylesheetsVinylUrls]))
  }
}
