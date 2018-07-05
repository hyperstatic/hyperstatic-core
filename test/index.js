'use strict'

const test = require('ava')
const HTMLis = require('./helper/html-is')

const hyperstatic = require('..')

test('resolve urls into absolutes', async t => {
  const url = 'https://audiense.com'
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `

  HTMLis(
    t,
    await hyperstatic({ html, url, absoluteUrls: true }),
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="https://audiense.com/wp-content/themes/social-bro/static/script.js" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `
  )
})

test('resolve urls into relatives', async t => {
  const url = 'https://audiense.com'
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `

  HTMLis(
    t,
    await hyperstatic({ html, url }),
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `
  )
})

test("don't resolve invalid urls", async t => {
  const url = 'https://audiense.com'
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="http://" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `

  HTMLis(
    t,
    await hyperstatic({ html, url }),
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="http://" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `
  )
})

test('html compilant', async t => {
  const url = 'https://audiense.com'
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="/wp-content/themes/social-bro/static/script.js" as="script" />
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `

  HTMLis(
    t,
    await hyperstatic({ html, url, absoluteUrls: true }),
    `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="preload" href="https://audiense.com/wp-content/themes/social-bro/static/script.js" as="script">
    <title>Document</title>
  </head>
  <body>
    <div>Hello world</div>
  </body>
  </html>
  `
  )
})
