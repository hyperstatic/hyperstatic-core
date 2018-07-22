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

test('inline css', macro, {
  input: {
    html:
      '<div class="db w-100 h0 pb50 bg-center cover mb2" style="background-image: url(&quot;/images/windtoday.png&quot;); will-change: transform; transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);" data-tilt="" data-tilt-max="10" data-tilt-glare="" data-tilt-max-glare="0.8" data-tilt-reverse="true"><div class="js-tilt-glare" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; overflow: hidden;"><div class="js-tilt-glare-inner" style="position: absolute; top: 50%; left: 50%; pointer-events: none; background-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%); width: 1104px; height: 1104px; transform: rotate(180deg) translate(-50%, -50%); transform-origin: 0% 0% 0px; opacity: 0;"></div></div></div>',
    url: 'https://kikobeats.com/'
  },
  output: {
    html:
      '<html><head></head><body><div class="db w-100 h0 pb50 bg-center cover mb2" style="background-image: url(https://kikobeats.com/&quot;/images/windtoday.png&quot;); will-change: transform; transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);" data-tilt="" data-tilt-max="10" data-tilt-glare="" data-tilt-max-glare="0.8" data-tilt-reverse="true"><div class="js-tilt-glare" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; overflow: hidden;"><div class="js-tilt-glare-inner" style="position: absolute; top: 50%; left: 50%; pointer-events: none; background-image: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 100%); width: 1104px; height: 1104px; transform: rotate(180deg) translate(-50%, -50%); transform-origin: 0% 0% 0px; opacity: 0;"></div></div></div></body></html>',
    urls: [
      {
        url: 'https://kikobeats.com/&quot;/images/windtoday.png&quot;',
        pathname: '/kikobeats.com/&quot;/images/windtoday.png&quot;',
        extension: '.png&quot;'
      }
    ]
  }
})
