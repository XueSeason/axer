const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Request = require('../app').request
const file = require('../app').file

describe('test file module and request module', done => {
  const dir = path.resolve(__dirname, './locals')
  it('mkdir should complete without error', () => {
    return file.mkdir(dir)
  })

  const cookieJarPath = path.resolve(dir, './cookieJar.json')
  it('touch should complete without error', () => {
    return file.touch(cookieJarPath)
  })

  const inputData = '{}'
  it('echo should complete without error', () => {
    return file.echo(inputData, cookieJarPath)
  })

  it('cat should read data equals echo content', () => {
    return file.cat(cookieJarPath).then(data => {
      assert.equal(inputData, data)
    })
  })

  it('tail should complete without error', () => {
    return file.tail(cookieJarPath).then(data => {
      assert.equal(inputData, data)
    })
  })

  const request = new Request()
  it('request get google home', () => {
    return request.get('https://www.google.com').then(res => {
      assert.equal(200, res.statusCode)
    })
  })

  it('request post facebook login', () => {
    const email = 'email'
    const pass = 'pass'
    request.get('https://www.facebook.com').then(() => {
      return request.post(
        'https://www.facebook.com/login.php?login_attempt=1',
        { email, pass }).then(res => {
          assert.equal(200, res.statusCode)
        })
    })
  })

  it('request redirect via get my blog home', () => {
    request.get('http://xueseason.github.io').then(res => {
      assert.equal(200, res.statusCode)
    })
  })
})