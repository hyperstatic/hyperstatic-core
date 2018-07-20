'use strict'

const test = require('ava')
const prettyHTML = require('./helper/pretty-html')

const extract = require('../src/extract')

const macro = async (t, { input, output }) => {
  const { html: outputHtml } = await extract(input)
  t.is(prettyHTML(outputHtml), prettyHTML(output.html))
}

test('resolve relatives urls from the markup', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  }
})

test('resolve relatives urls from the markup on the same domain', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="https://audiense.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  }
})

test('search as part of the url resolved from the markup', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="https://audiense.com/test.js?hello=world" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/test.js?hello=world" as="script"></head><body></body></html>`
  }
})

test('subdomain as part of the url resolved from the markup', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="https://www.audiense.com/test.js?hello=world" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/www/test.js?hello=world" as="script"></head><body></body></html>`
  }
})

test("don't resolve invalid urls from the markup", macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>`
  }
})
