'use strict'

const test = require('ava')
const HTMLis = require('./helper/html-is')

const hyperstatic = require('../src/normalize')

test('resolve relative urls', async t => {
  const { html } = await hyperstatic({
    html:
      '<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com',
    absoluteUrls: false
  })

  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  )
})

test("don't resolve invalid urls", async t => {
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

test('search as part of the url', async t => {
  const { html } = await hyperstatic({
    html: `<html><head></head><body><a href="http://www-01.ibm.com/common/ssi/cgi-bin/ssialias?subtype=XB&amp;infotype=PM&amp;appname=GBSE_GB_TI_USEN&amp;htmlfid=GBE03593USEN&amp;attachment=GBE03593USEN.PDF"></a></body></html>`,
    url: 'https://audiense.com',
    absoluteUrls: false
  })
  HTMLis(
    t,
    html,
    `<html><head></head><body><a href="www-01/common/ssi/cgi-bin/ssialias?subtype=XB&amp;infotype=PM&amp;appname=GBSE_GB_TI_USEN&amp;htmlfid=GBE03593USEN&amp;attachment=GBE03593USEN.PDF"></a></body></html>`
  )
})

test('absoluteUrls options', async t => {
  const { html } = await hyperstatic({
    html: `<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`,
    url: 'https://google.com',
    absoluteUrls: true
  })
  HTMLis(
    t,
    html,
    `<html><head><link rel="preload" href="https://google.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`
  )
})
