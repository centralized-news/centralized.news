'use strict';

module.exports = require(__dirname + '/lib/middleware.js');
module.exports.handlers = {
	file: require(__dirname + '/lib/handlers/file.js')
};