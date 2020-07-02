'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var supertest = require('supertest');
var app = require('express')();
var cookieParser = require('cookie-parser')();
var middleware = require('../index.js')({
	handler: 'file',
	opts: {
		path: path.resolve(__dirname, 'fixtures')
	}
});
var sid = '156ddf0eec97c7c2dc83831bfccd1cc9';
var expected = fs.readFileSync(__dirname + '/fixtures/' + sid + '.json', { encoding: 'utf8' });
var url;

// Set up basic express server
app.use(cookieParser);
app.get('/', middleware, function(req, res) {
	if (req.sessionError) {
		return res.end(JSON.stringify(req.sessionError.message));
	}

	res.end(JSON.stringify(req.session));
});

// Run
describe('PHP session middleware', function(){
	it('should have no req.session by default', function(done) {
		supertest(app)
			.get('/')
			.expect(200, '', done);
	});
	it('should properly load a session via a query string', function(done) {
		supertest(app)
			.get('/?PHPSESSID=' + sid)
			.expect(200, expected, done);
	});
	it('should properly load a session via cookies', function(done) {
		supertest(app)
			.get('/')
			.set('Cookie', 'PHPSESSID=' + sid)
			.expect(200, expected, done);
	});
})