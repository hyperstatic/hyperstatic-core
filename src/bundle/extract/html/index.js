'use strict'

const { concat } = require('lodash')

const fromStylesheets = require('./inline-css')
const fromTags = require('./normalize-tags')
const loadHTML = require('./load-html')

module.exports = ({ html, url }) => {
  const $ = loadHTML(html)
  const tags = fromTags($, url)
  const stylesheets = fromStylesheets(url, tags.html)
  const vinylUrls = concat(tags.vinylUrls, stylesheets.vinylUrls)
  return { html: stylesheets.html, vinylUrls }
}