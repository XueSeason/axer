const Promise = require('bluebird')
const logger = require('log4js').getLogger()

function promisify(func, params) {
  return new Promise((resolve, reject) => {
    func(params, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

function parseForm(str) {
  const form = {}
  const arr = str.split('&')
  arr.forEach(qs => {
    const i = qs.indexOf('=')
    const key = qs.slice(0, i)
    const value = decodeURIComponent(qs.slice(i + 1))
    form[key] = value
  })
  return form
}

function decodeURIForm(form) {
  const copyForm = {}
  const keys = Object.keys(form)
  keys.forEach(key => {
    copyForm[key] = decodeURIComponent(form[key])
  })
  return copyForm
}

function encodeURIForm(form) {
  const keys = Object.keys(form)
  return keys.map(key => {
    if (form[key]) {
      return `${key}=${encodeURIComponent(form[key])}`
    } else {
      return key
    }
  }).join('&')
}

exports.promisify = promisify
exports.parseForm = parseForm
exports.decodeURIForm = decodeURIForm
exports.encodeURIForm = encodeURIForm
