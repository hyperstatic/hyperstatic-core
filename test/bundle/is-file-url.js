'use strict'

const test = require('ava')

const isFileUrl = require('../../src/bundle/extract/is-file-url')

test('spotify', t => {
  t.is(false, isFileUrl('https://spotify.com'))
  t.is(true, isFileUrl('https://open.spotify.com/user/1170688168?si=3Ao2GMS_R4iJMtrINB2rYQ'))
})

test('vimeo', t => {
  t.is(true, isFileUrl('https://player.vimeo.com/video/222071386'))
  t.is(false, isFileUrl('https://vimeo.com'))
})

test('now.sh', t => {
  t.is(false, isFileUrl('https://carbon.now.sh'))
  t.is(false, isFileUrl('https://unavatar.now.sh'))
  t.is(true, isFileUrl('https://google.com/script.sh'))
})
