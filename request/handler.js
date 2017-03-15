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
  return keys.map(key => `${key}=${encodeURIComponent(form[key])}`).join('&')
}

async function followRedirect(response, request) {
  if (response.statusCode === 302) {
    const url = response.headers.location
    logger.info('Auto Follow:', url)
    const res = await promisify(request, url)
    return await followRedirect(res, request)
  } else {
    return response
  }
}

exports.promisify = promisify
exports.parseForm = parseForm
exports.decodeURIForm = decodeURIForm
exports.encodeURIForm = encodeURIForm
exports.followRedirect = followRedirect
