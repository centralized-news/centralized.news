# read-yaml-promise

[![Build Status](https://travis-ci.org/shinnn/read-yaml-promise.svg?branch=master)](https://travis-ci.org/shinnn/read-yaml-promise)
[![Build status](https://ci.appveyor.com/api/projects/status/7gww0bcaas24rshu?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/read-yaml-promise)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/read-yaml-promise.svg)](https://coveralls.io/r/shinnn/read-yaml-promise)
[![Dependency Status](https://david-dm.org/shinnn/read-yaml-promise.svg)](https://david-dm.org/shinnn/read-yaml-promise)
[![devDependency Status](https://david-dm.org/shinnn/read-yaml-promise/dev-status.svg)](https://david-dm.org/shinnn/read-yaml-promise#info=devDependencies)

[Promise] to read and parse a [YAML](http://yaml.org/) file

```javascript
var readYaml = require('read-yaml-promise');

// fixture.yaml
// - 'foo'
// - false

readYaml('fixture.yaml')
.then(function(data) {
  data; //=> ['foo', false]
})
.catch(function(err) {
  console.log(err.message);
});
```

## Installation

[![NPM version](https://badge.fury.io/js/read-yaml-promise.svg)](https://www.npmjs.org/package/read-yaml-promise)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```
npm install read-yaml-promise
```

## API

```javascript
var readYaml = require('read-yaml-promise');
```

### readYaml(*filePath* [, *options*])

*filePath*: `String` (file path)  
*options*: `Object` (options for [js-yaml](https://github.com/nodeca/js-yaml)'s [safeLoad](https://github.com/nodeca/js-yaml#safeload-string---options-) method and [fs.readFile](http://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback)), or `String` (file encoding)  
Return: `Object` ([Promise])

When it finish reading and parsing a YAML file, it will be [*fulfilled*](http://promisesaplus.com/#point-26) with an `Object` of the parsed data as its first argument.

When it fails to read or parse a file, it will be [*rejected*](http://promisesaplus.com/#point-30) with an error as its first argument.

```javascript
var readYaml = require('read-yaml-promise');
var FAILSAFE_SCHEMA = require('js-yaml').FAILSAFE_SCHEMA; // npm install js-yaml 

// fixture.yml (foo: true)

readYaml('fixture.yml').then(function(data) {
  typeof data.foo; //=> 'boolean'
});

readYaml('fixture.yml', {schema: FAILSAFE_SCHEMA}).then(function(contents) {
  typeof data.foo; //=> 'string'
});
```

#### options

Note that `filename` option is automatically specified using the first argument.

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[Promise]: http://promisesaplus.com/
