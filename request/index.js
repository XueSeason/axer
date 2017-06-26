const fs = require('fs')
const request = require('request')
const FileCookieStore = require('tough-cookie-filestore-bugfixed')
const logger = require('log4js').getLogger()
const Promise = require('bluebird')

const handler = require('./handler')

const { promisify, parseForm, decodeURIForm, encodeURIForm } = handler

/**
 * Request Constructor
 * @param {string} cookiePath cookieJar file path. If undefined, the request won't take any cookie.
 * @param {object} config request config.
 */
function Request (cookiePath, config) {
  const defaultConfig = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
    },
    followRedirect: false,
    gzip: true,
    timeout: 20000
  }

  const appendConfig = config || {}

  if (cookiePath) {
    const jar = request.jar(new FileCookieStore(cookiePath))
    appendConfig.jar = jar
  }

  this.request = request.defaults(Object.assign(defaultConfig, appendConfig))
  // avoid redirct cycle
  this.maxRedirects = 10
  this.redirects = 0
}

/**
 * Request server with GET method.
 * @param {string} url Request URL.
 * @param {object} params QueryString dictionary object. Axer will automaticlly encode all params value for request.
 * @return {Object} Axer will combine request object and response object and return to developer.
 */
Request.prototype.get = async function (url, params, follow = true) {
  let _url = url

  if (typeof params === 'object') {
    const qs = encodeURIForm(params)
    _url = `${_url}?${qs}`
  } else if (typeof params === 'boolean') {
    follow = params
  }

  logger.info('GET', _url)
  const res = await promisify(this.request, _url)

  if (follow) {
    const response = await this.followRedirect(res)
    return response
  } else {
    return res
  }
}

/**
 * Request server with POST method.
 * @param {string} url Request URL.
 * @param {object} form post data.
 * @return {Object} Axer will combine request object and response object and return to developer.
 */
Request.prototype.post = async function (url, option, form) {
  if (form === undefined) {
    form = option
    option = { type: 'form' } // x-www-form-urlencoded
  }

  if (option.type === 'form') {
    if (typeof form === 'object') {
      form = decodeURIForm(form)
    }

    if (typeof form === 'string') {
      form = parseForm(form)
    }

    logger.info('POST ', url)
    logger.info('Body:', form)
    const res = await promisify(this.request.post, { url, form })
    const response = await this.followRedirect(res)
    return response
  } else if (option.type === 'json') {
    logger.info('POST ', url)
    logger.info('Body:', form)
    const res = await promisify(this.request, { uri: url, method: 'POST', json: form })
    const response = await this.followRedirect(res)
    return response
  } else {
    console.error('未支持的格式')
  }
}

/**
 * Download file from server.
 * @param {string} url download url.
 * @param {string} filePath the file's save path.
 * @return {promise} return promise object for conveniently use aync/await.
 */
Request.prototype.download = function (url, filePath) {
  return new Promise((resolve, reject) => {
    this.request.get(url)
      .on('response', res => {
        logger.info(`Status: ${res.statusCode}`)
        logger.info(`Content-Type: ${res.headers['content-type']}`)
        logger.info(`Content-Length: ${res.headers['content-length']}`)
      })
      .on('end', () => {
        logger.info(`Download success`)
        resolve(url)
      })
      .on('error', err => {
        logger.error(`Download failed: ${err}`)
        reject(err)
      })
      .pipe(fs.createWriteStream(filePath))
  })
}

/**
 * Upload file to server.
 * @param {string} url download url.
 * @param {string} formData the request formData.
 * @return {promise} return promise object for conveniently use aync/await.
 */
Request.prototype.upload = function (url, formData) {
  logger.info('POST FormData', url)
  logger.info('Body:', formData)
  const response = promisify(this.request.post, { url, formData })
  return response
}

/**
 * Creae a binary stream pipe.
 * @param {string} url download url.
 * @return {promise} return promise object for conveniently use aync/await.
 */
Request.prototype.pipe = function (url) {
  return new Promise((resolve, reject) => {
    const res = this.request.get(url)
      .on('response', res => {
        logger.info(`Status: ${res.statusCode}`)
        logger.info(`Content-Type: ${res.headers['content-type']}`)
        logger.info(`Content-Length: ${res.headers['content-length']}`)
      })
      .on('end', () => {
        logger.info(`Download success`)
        resolve(url)
      })
      .on('error', err => {
        logger.error(`Download failed: ${err}`)
        reject(err)
      })

    resolve(res)
  })
}

Request.prototype.followRedirect = async function (response) {
  if (response.statusCode >= 300 && response.statusCode < 400) {
    if (this.redirects >= this.maxRedirects) {
      throw new Error('Too many redircts, the default max redircts is:' + this.maxRedirects)
    } else {
      this.redirects++
      const url = response.headers.location
      logger.info('Auto Follow:', url)
      const res = await promisify(this.request, url)
      const result = await this.followRedirect(res)
      return result
    }
  } else {
    this.redirects = 0
    return response
  }
}

module.exports = Request
