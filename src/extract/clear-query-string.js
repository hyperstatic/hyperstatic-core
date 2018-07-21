'use strict'

module.exports = url => {
  const urlparts = url.split('?')
  return urlparts.length >= 2 ? urlparts[0] : url
}
