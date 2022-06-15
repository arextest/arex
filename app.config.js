const path = require('path')
const packageConfig = require(path.resolve(__dirname, './package.json'))

module.exports = {
  AppID: packageConfig.AppID,
  Env: 'fws',
}
