const express = require('express')
const app = express()
const { createProxyMiddleware } = require('http-proxy-middleware')
const proxy = require('./config/proxy')
// const envMap = require('./config/envMap.json')
const { config = {} } = require('./package.json')
let { port = 8080, env = 'FAT' } = config



const history = require('connect-history-api-fallback')

// 健康检查
app.get('/vi/health', (req, res) => {
  res.end(`365ms`)
})

app.use(history()) // 这里千万要注意，要在static静态资源上面
// 托管静态文件
app.use(express.static('dist'))

// 监听8080端口
app.listen(8080, function () {
  console.log('hi')
})
