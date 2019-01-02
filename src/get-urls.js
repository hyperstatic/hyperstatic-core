'use strict'

const fromXML = require('xml-urls')
const aigle = require('aigle')

const resolveUrl = async (url, opts) =>
  fromXML.isXmlUrl(url) ? fromXML(url, opts) : [url]

const iterator = async ({ set, url, opts }) => {
  const urls = await resolveUrl(url, opts)
  return new Set([...set, ...urls])
}

module.exports = async (urls, opts) => {
  const set = await aigle.reduce(
    urls,
    (set, url) => iterator({ set, url, opts }),
    new Set()
  )
  return Array.from(set)
}
