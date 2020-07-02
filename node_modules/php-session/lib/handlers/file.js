'use strict';

var fs = require('fs');
var path = require('path');
var unserialize = require('php-unserialize').unserializeSession;

function MyPromise(cb, fn) {
	return new Promise(function(resolve, reject) {
		if (cb) {
			resolve = function(result) {
				cb(null, result);
			};
			reject = cb;
		}
		fn.call(this, resolve, reject);
	});
}

function FileSessionHandler(opts) {
	// Load with options
	var self = this;
	Object.keys(opts).forEach(function(key) {
		self[key] = opts[key];
	});
}

FileSessionHandler.prototype.path = '/tmp';
FileSessionHandler.prototype.subdirectories = 0;

FileSessionHandler.prototype.pathToSid = function(sid) {
	if (!String(sid).match(/[a-z0-9]{24,40}/i)) {
		throw new Error('Invalid session ID');
	}

	var pathParts = [this.path];
	var idx;

	for (idx = 0; idx < this.subdirectories; idx++) {
		pathParts.push(sid.charAt(idx));
	}

	pathParts.push('sess_' + sid);

	return path.join.apply(this, pathParts);
}

FileSessionHandler.prototype.sessionExists = function(sid, cb) {
	var handler = this;
	return new MyPromise(cb, function(resolve, reject) {
		try {
			var sessionFile = handler.pathToSid(sid);
			fs.exists(sessionFile, function(exists) {
				return resolve(exists);
			});
		} catch (e) {
			return reject(e);
		}
	});
}

FileSessionHandler.prototype.getSession = function(sid, cb) {
	var handler = this;
	return new MyPromise(cb, function(resolve, reject) {
		try {
			var sessionFile = handler.pathToSid(sid);
			var opts = { encoding: 'utf8' };
			fs.readFile(sessionFile, opts, function(err, raw) {
				if (err) {
					return reject(err);
				}

				try {
					var data = unserialize(raw);
					return resolve(data);
				} catch (e) {
					return reject(e);
				}
			});
		} catch (e) {
			return reject(e);
		}
	});
}

module.exports = FileSessionHandler;