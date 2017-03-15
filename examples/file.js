const file = require('../file')
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
