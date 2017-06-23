const fs = require('fs')
const Promise = require('bluebird')

function stat (filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return reject(err)
      }
      return resolve(stats)
    })
  })
}

function open (filePath) {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'r', (err, fd) => {
      if (err) {
        return reject(err)
      }
      return resolve(fd)
    })
  })
}

function readPreviousChar (fd, stats, currentCharacterCount) {
  return new Promise((resolve, reject) => {
    fs.read(
      fd,
      new Buffer(1),
      0,
      1,
      stats.size - 1 - currentCharacterCount,
      (err, bytesRead, buffer) => {
        if (err) {
          return reject(err)
        }
        return resolve(buffer[0])
      }
    )
  })
}

async function read (fd, stats, lines) {
  let data = ''
  let i = 0
  let lineCount = 0
  while (true) {
    const char = await readPreviousChar(fd, stats, i++)
    if (char === 0x0a) { // 0x0a === '\n'
      lineCount++
    }
    if (lineCount === lines) {
      break
    }
    if (data.length >= stats.size) {
      break
    }
    data = String.fromCodePoint(char) + data
  }
  return data
}

module.exports = async function (filePath, lines) {
  const lastLines = lines || 10
  const stats = await stat(filePath)
  const fd = await open(filePath)
  const data = await read(fd, stats, lastLines)
  return data
}
