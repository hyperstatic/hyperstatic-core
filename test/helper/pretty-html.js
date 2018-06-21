'use strict'

const pretty = require('pretty')

module.exports = html => pretty(html, { ocd: true })
