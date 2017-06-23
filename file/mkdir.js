const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')

function access (dir) {
  return new Promise((resolve, reject) => {
    fs.access(dir, err => {
      if (err) {
        reject(err)
        return
      }
      resolve(dir)
    })
  })
}

function mkdir (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
      if (err) {
        reject(err)
        return
      }
      resolve(dir)
    })
  })
}

/**
 * equals mkdir -p `directory`
 * @param {string} directory create directory string
 */
module.exports = async function (directory) {
  const start = directory[0]
  if (start !== '/') {
    throw new Error('PATHERR: Expected absolute path.')
  }
  const hierarchy = directory.split('/')

  let anchorPath = path.resolve('/')
  for (let i = 0; i < hierarchy.length; i++) {
    const layer = hierarchy[i]
    anchorPath = path.resolve(anchorPath, layer)
    try {
      await access(anchorPath)
    } catch (err) {
      if (err.code === 'ENOENT') {
        await mkdir(anchorPath)
      }
    }
  }
}
