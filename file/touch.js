const fs = require('fs')
const Promise = require('bluebird')

module.exports = function touch (filePath) {
  return new Promise((resolve, reject) => {
    fs.open(filePath, 'a+', (err, fd) => {
      if (err) {
        return reject(err)
      }

      fs.close(fd, err => {
        if (err) {
          return reject(err)
        }

        resolve(filePath)
      })
    })
  })
}