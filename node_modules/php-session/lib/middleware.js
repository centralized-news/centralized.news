'use strict';

module.exports = function(config) {
	config = config || {};
	var sidName = config.sidName || 'PHPSESSID';
	var handlerName = config.handler || 'file';
	var handlerOpts = config.opts || {};
	var sessionName = config.sessionName || 'session';
	var sessionErrorName = config.sessionErrorName || 'sessionError';
	var HandlerClass = require(__dirname + '/handlers/' + handlerName + '.js');
	var handler = new HandlerClass(handlerOpts);

	return function (req, res, next) {
		var sid = null;
		if (req.cookies && req.cookies[sidName]) {
			sid = req.cookies[sidName];
		} else if (req.query[sidName]) {
			sid = req.query[sidName];
		}

		// Stop if there's no session ID
		if (!sid) {
			return next();
		}

		handler.getSession(sid).then(function(session) {
			req[sessionName] = session;
			return next();
		}).catch(function(e) {
			req[sessionErrorName] = e;
			return next();
		});
	}
}