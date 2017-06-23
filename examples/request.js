const path = require('path')

;(async function demo () {
  const cookieJarPath = path.resolve(__dirname, './locals', 'cookieJar.json')
  const Request = require('../request')

  // You can set proxy and request google in China
  const request = new Request(cookieJarPath, {
    proxy: 'http://****:**'
  })
  await request.get('https://www.google.com')

  // login facebook, check result in locals/cookieJar.json
  const email = 'email'
  const pass = 'pass'
  await request.get('https://www.facebook.com')
  await request.post('https://www.facebook.com/login.php?login_attempt=1', { email, pass })

  // or post json
  await request.post('http://localhost:4000/search/result', { type: 'json' }, {
    keyword: 'hello',
    country: 'cn'
  })

  const youtubeMusicUrl = 'https://www.youtube.com/audiolibrary_download?f=m&vid=2837bb75829ae65a'
  await request.download(youtubeMusicUrl, path.resolve(__dirname, './locals', 'mymusic.mp3'))
})()
