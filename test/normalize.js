'use strict'

const test = require('ava')
const HTMLis = require('./helper/html-is')

const hyperstatic = require('../src/normalize')

test('resolve relatives urls from the markup', async t => {
  const { html } = await hyperstatic({
    html:
      '<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  )
})

test('resolve relatives urls from the markup on the same domain', async t => {
  const { html } = await hyperstatic({
    html:
      '<html><head><link rel="preload" href="https://audiense.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  )
})

test('search as part of the url resolved from the markup', async t => {
  const { html } = await hyperstatic({
    html:
      '<html><head><link rel="preload" href="https://audiense.com/test.js?hello=world" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="/test.js?hello=world" as="script"></head><body></body></html>`
  )
})

test('subdomain as part of the url resolved from the markup', async t => {
  const { html } = await hyperstatic({
    html:
      '<html><head><link rel="preload" href="https://www.audiense.com/test.js?hello=world" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="/www/test.js?hello=world" as="script"></head><body></body></html>`
  )
})

test("don't resolve invalid urls from the markup", async t => {
  const { html } = await hyperstatic({
    html: `<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>`,
    url: 'https://audiense.com',
    absoluteUrls: true
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>`
  )
})

test("don't resolve external urls", async t => {
  const { html } = await hyperstatic({
    html: `<html><head><link rel="preload" href="https://google.com/foobar" as="script"></head><body></body></html>`,
    url: 'https://audiense.com',
    absoluteUrls: true
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="https://google.com/foobar" as="script"></head><body></body></html>`
  )
})
