'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var supertest = require('supertest');
var app = require('express')();
var cookieParser = require('cookie-parser')();
var middleware = require('../index.js')();
var sid = '156ddf0eec97c7c2dc83831bfccd1cc9';
var expected = fs.readFileSync(__dirname + '/fixtures/' + sid + '.json', { encoding: 'utf8' });
var url;

// Set up basic express server
app.use(cookieParser);
app.get('/', middleware, function(req, res) {
	if (req.sessionError) {
		return res.end('ERROR '+JSON.stringify(req.sessionError.message.substr(0,12)));
	}

	res.end(JSON.stringify(req.$SESSION));
});

// Run
describe('PHP session middleware with other session name', function(){
	it('should have no req.$SESSION by default', function(done) {
		supertest(app)
			.get('/')
			.expect(200, '', done);
	});
	it('should emit an error', function(done) {
		supertest(app)
			.get('/?PHPSESSID=' + sid)
			.expect(200, /ERROR "ENOENT.*"/, done);
	});
})