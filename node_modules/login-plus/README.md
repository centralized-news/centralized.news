# login-plus
login service for express

![stable](https://img.shields.io/badge/stability-stable-brightgreen.svg)
[![npm-version](https://img.shields.io/npm/v/login-plus.svg)](https://npmjs.org/package/login-plus)
[![downloads](https://img.shields.io/npm/dm/login-plus.svg)](https://npmjs.org/package/login-plus)
[![build](https://img.shields.io/travis/codenautas/login-plus/master.svg)](https://travis-ci.org/codenautas/login-plus)
[![coverage](https://img.shields.io/coveralls/codenautas/login-plus/master.svg)](https://coveralls.io/r/codenautas/login-plus)
[![dependencies](https://img.shields.io/david/codenautas/login-plus.svg)](https://david-dm.org/codenautas/login-plus)


language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)


# install


```sh
> npm install login-plus
```


# Use


```js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

var loginPlus = new (require('login-plus').Manager);

loginPlus.init(app,{ successRedirect:'/index' });

loginPlus.setValidator(
    function(username, password, done) {
        if(username === 'admin' && password === 'secret.pass'){
            done(null, {username: 'admin', when: Date()});
        }else{
            done('username or password error');
        }
    }
);

app.get('/user-info',function(req,res){
    res.end(
        'user: '+req.session.passport.username+
        ' logged since '+req.session.passport.when
    );
});

```


## loginPlus.init(app, opts)


From this line on, `loginPlus` controls whether the session is logged.
If not, it redirects to `/login`.

opts                | default opts         | use
--------------------|----------------------|---------------
loginPagePath       | *internal [1]*       | path to the .jade file that contains the login screen
loginPageServe      | *jade motor*         | function that serves the login page (use this function when a .jade file is not desired)
baseUrl             | `/`                  | base URL for all other URLs
successRedirect     | *mandatory*          | successful login path
successReturns      | false                | returns to previous path when login
loginUrlPath        | `/login`             | URL to the login page
noLoggedUrlPath     | `/login`             | URL to the unlogged page where the authentification is required when trying to log in
failedLoginUrlPath  | `/login`             | URL to the failing login page
userFieldName       | `username`           | name of the "username" field
secret              | random key           | keys for cookies
alreadyLoggedIn     | successRedirect      | `/login` redirection when is already logged
skipCheckAlreadyLoggedIn | false           | allows `/login` redirects to login page even if the user is already logged
**php**             | false                | hibrid login system mergin with PHP
.save_path          |                      | path of PHP session files
.varLogged          |                      | `$SESSION` variable name for login control
**loginForm**       |                      | opciones del formulario de login
.usernameLabel      | `Username`           | username label
.passwordLabel      | `Password`           | password label
.buttonLabel        | `Log In`             | button label
.formTitle          | `login`              | form title
.formImg            |                      | form image
.autoLogin          | false                | enable direct login from URL with `?u=user&p=pass&a=1`
store.module        | null                 | function that returns the constructor of the module to store sessions (it receive the express-session instance as first argument)

From this point on, the middlewares can access the data session contained in `req.user`.



## loginPlus.setValidator(fn)


It registers the function that the user must validate and in case of success, obtains
the additional necessary information for the session (for example, role or level of permission)
that will be available in `req.session.passport`


# License


[MIT](LICENSE)
