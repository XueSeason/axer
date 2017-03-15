const assert = require('assert')
const fs = require('fs')
const path = require('path')
const util = require('../app').util

describe('test util', done => {
  const sleepTime = 1000
  it(`sleep complete should approximately equal ${sleepTime}ms`, () => {
    return util.sleep(sleepTime)
  })
})

