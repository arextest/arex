var path = require('path');
var packageConfig = require(path.resolve(__dirname, './package.json'));

module.exports = {
	'AppID': packageConfig.AppID,
	'Env': {$~env}
};
