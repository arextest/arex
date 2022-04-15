const config = require('./package.json');
const express = require('express');
const request = require('request');
const fs = require('fs');
const moment = require('moment');

const { port = 8088 } = config;
const proxy = config.proxy[process.env.PAAS_ENV ?? 'UAT'];

const app = express();

app.use(express.static('dist'));
app.get('/health.html', (req, res) => res.end(`${Date.now()}ms`));
app.listen(port, () => console.log(`Listening on port ${port}!`));

fs.mkdir("logs",() => {});
const logger = fs.createWriteStream("./logs/request.txt");
logger.write('Current Env : ' + process.env.PAAS_ENV + '\n');

app.use('*', (req, res) => {
  const originalUrl = req.originalUrl.substring(1);
  const index = originalUrl.indexOf("/");
  let url = proxy[originalUrl.substring(0, index)] + originalUrl.substring(index);
  logger.write(moment().format("YYYY-MM-DD HH:mm:ss") + '\n' + 'Whole URL: ' + url + '\n\n');
  try {
    req.pipe(request(url)).pipe(res);
  } catch (err) {
    logger.write(err + '\n');
  }
});
