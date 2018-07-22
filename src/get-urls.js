'use strict'

const fromXML = require('xml-urls')
const aigle = require('aigle')

const resolveUrl = async url => (fromXML.isXml(url) ? fromXML(url) : [url])

const iretator = async (set, url) =>
  new Set([...set, ...(await resolveUrl(url))])

module.exports = async urls => {
  const set = await aigle.reduce(urls, iretator, new Set())
  return Array.from(set)
}
