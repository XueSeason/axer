const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')

const touch = require('./touch')

function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, err => {
      if (err) {
        return reject(err)
      }
      resolve(filePath)
    })
  })
}

module.exports = async function (content, filePath) {
  await touch(filePath)
  await writeFile(filePath, content)
}