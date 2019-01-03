'use strict'

const { uniq, concat } = require('lodash')
const fromXML = require('xml-urls')
const { reduce } = require('aigle')

const { isXmlUrl } = fromXML

module.exports = async (urls, opts) => {
  const collection = uniq(concat(urls))

  const iterator = async (set, url) => {
    const urls = isXmlUrl(url) ? fromXML(url, opts) : [url]
    return new Set([...set, ...urls])
  }

  const set = await reduce(collection, iterator, new Set())
  return Array.from(set)
}
