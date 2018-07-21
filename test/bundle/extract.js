'use strict'

const test = require('ava')
const prettyHTML = require('../helper/pretty-html')

const extract = require('../../src/bundle/extract')

const macro = async (t, { input, output }) => {
  const { html: outputHtml, urls: outputUrls } = await extract(input)
  t.is(prettyHTML(outputHtml), prettyHTML(output.html))
  t.deepEqual(outputUrls, output.urls)
}

test('absolute urls', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="https://audiense.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/audiense.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`,
    urls: [
      {
        url:
          'https://audiense.com/wp-content/themes/social-bro/static/script.js',
        pathname: '/audiense.com/wp-content/themes/social-bro/static/script.js',
        extension: '.js'
      }
    ]
  }
})

test('relative urls', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/audiense.com/wp-content/themes/social-bro/static/script.js" as="script"></head><body></body></html>`,
    urls: [
      {
        url:
          'https://audiense.com/wp-content/themes/social-bro/static/script.js',
        pathname: '/audiense.com/wp-content/themes/social-bro/static/script.js',
        extension: '.js'
      }
    ]
  }
})

test('extract urls from css files', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="./build/assets/style.css" as="script"></head><body></body></html>',
    url: 'https://elenatorro.github.io'
  },
  output: {
    html:
      '<html><head><link rel="preload" href="/elenatorro.github.io/build/assets/style.css" as="script"></head><body></body></html>',
    urls: [
      {
        url: 'https://elenatorro.github.io/build/assets/style.css',
        pathname: '/elenatorro.github.io/build/assets/style.css',
        extension: '.css'
      },
      {
        url:
          'https://elenatorro.github.io/assets/styles/fonts/Open_Sans/OpenSans-Bold.ttf',
        pathname:
          '/elenatorro.github.io/assets/styles/fonts/Open_Sans/OpenSans-Bold.ttf',
        extension: '.ttf'
      },
      {
        url:
          'https://elenatorro.github.io/assets/styles/fonts/EB_Garamond/EBGaramond-Regular.ttf',
        pathname:
          '/elenatorro.github.io/assets/styles/fonts/EB_Garamond/EBGaramond-Regular.ttf',
        extension: '.ttf'
      },
      {
        url:
          'https://elenatorro.github.io/assets/images/elenatorro_profile.png',
        pathname: '/elenatorro.github.io/assets/images/elenatorro_profile.png',
        extension: '.png'
      }
    ]
  }
})

test('search as part of the url resolved from the markup', macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="https://audiense.com/test.js?hello=world" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="/audiense.com/test.js?hello=world" as="script"></head><body></body></html>`,
    urls: [
      {
        url: 'https://audiense.com/test.js?hello=world',
        pathname: '/audiense.com/test.js?hello=world',
        extension: '.js'
      }
    ]
  }
})

test("don't resolve invalid urls", macro, {
  input: {
    html:
      '<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>',
    url: 'https://audiense.com'
  },
  output: {
    html: `<html><head><link rel="preload" href="http://" as="script"></head><body></body></html>`,
    urls: []
  }
})
