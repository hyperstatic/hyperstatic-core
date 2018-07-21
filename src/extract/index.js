'use strict'

const fromHTML = require('./html')
const fromUrls = require('./urls')

module.exports = async opts => {
  const { html, vinylUrls } = await fromHTML(opts)
  const urls = await fromUrls(vinylUrls)
  return { html, urls }
}
