'use strict'

const prettyHTML = require('./pretty-html')

module.exports = async (t, input, output) =>
  t.is(prettyHTML(input), prettyHTML(output))
