# Axer

[![npm](https://img.shields.io/npm/v/axer.svg?style=flat-square)](https://www.npmjs.com/package/axer)
[![Build Status](https://travis-ci.org/XueSeason/axer.svg?branch=master)](https://travis-ci.org/XueSeason/axer)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/XueSeason/axer/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/XueSeason/axer.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

The spider's sharp ax.:octocat:

## Installation

Axer uses the newest ES2015 feature `async/await`, requires node v7.6.0 or higher and async function support.

```bash
npm install --save axer
```

## Easy to use

```javascript
const fs = require('fs')
const path = require('path')

async function demo() {
  const cookieJarPath = path.resolve(__dirname, './locals', 'cookieJar.json')
  const Request = require('axer').request
  const request = new Request(cookieJarPath)

  // You can set proxy or other request config.
  // const request = new Request(cookieJarPath, {
  //   proxy: 'http://****:**'
  // })
  await request.get('https://www.google.com')

  // login facebook, check result in locals/cookieJar.json
  const email = 'email'
  const pass = 'pass'
  await request.get('https://www.facebook.com')
  await request.post('https://www.facebook.com/login.php?login_attempt=1', { email, pass })

  const youtubeMusicUrl = 'https://www.youtube.com/audiolibrary_download?f=m&vid=2837bb75829ae65a'
  await request.download(youtubeMusicUrl, path.resolve(__dirname, './locals', 'mymusic.mp3'))
}

demo()
```

We also encapsulate node's filesystem for conveniently maintain filesystem in Unix style.

```javascript
const file = require('axer').file
const path = require('path')

async function demo() {
  const dir = path.resolve(__dirname, './locals', 'file')
  await file.mkdir(dir)

  const filePath = path.resolve(dir, 'info.txt')
  await file.touch(filePath)
  await file.echo('goooooood.', filePath)
  const catContent = await file.cat(filePath)
  console.log(catContent)

  const tailContent = await file.tail(path.resolve(dir, 'py.txt'))
  console.log(tailContent)
}

demo()
```

## Documenation(Comming soon)

- 中文 API 文档
- API document
- FAQ

## Author

See [XueSeason](https://github.com/xueseason)

## License

MIT


