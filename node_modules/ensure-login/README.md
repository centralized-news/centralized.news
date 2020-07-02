# ensure-login

*Based on [jaredhanson's connect-ensure-login](https://github.com/jaredhanson/connect-ensure-login)*

   * Add `baseUrl` parameter in a way that permits Nginx and Apache redirects
   * Enance `setReturnTo` parameter. If a Regexp is passed the url is tested and only remember if it matchs with it.
   * Id Does not remember the url when an AJAX call was made (unles `setReturnWhenXhr` is set to true). 

This middleware ensures that a user is logged in.  If a request is received that
is unauthenticated, the request will be redirected to a login page.  The URL
will be saved in the session, so the user can be conveniently returned to the
page that was originally requested.

## Install

    $ npm install ensure-login

## Usage

#### Ensure Authentication

In this example, an application has a settings page where preferences can be
configured.  A user must be logged in before accessing this page.

    app.get('/settings',
      ensureLoggedIn({baseUrl:'/', redirectTo:'/login', setReturnTo:/^([^/]*|.*\/)[^.]+$/}),
      function(req, res) {
        res.render('settings', { user: req.user });
      });
      
If a user is not logged in when attempting to access this page, the request will
be redirected to `/login` and the original request URL (`/settings`) will be
saved to the session at `req.session.returnTo`.

#### Log In and Return To

This middleware integrates seamlessly with [Passport](http://passportjs.org/).
Simply mount Passport's `authenticate()` middleware at the login route.

    app.get('/login', function(req, res) {
      res.render('login');
    });

    app.post('/login', 
      passport.authenticate('local', { 
        successReturnToOrRedirect: '/', 
        failureRedirect: '/login' 
      })
    );
    
Upon log in, Passport will notice the `returnTo` URL saved in the session and
redirect the user back to `/settings`.

#### Step By Step

If the user is not logged in, the sequence of requests and responses that take
place during this process can be confusing.  Here is a step-by-step overview of
what happens:

1. User navigates to `GET /settings`
    - Middleware sets `session.returnTo` to `/settings`
    - Middleware redirects to `/login`
2. User's browser follows redirect to `GET /login`
    - Application renders a login form (or, alternatively, offers SSO)
3. User submits credentials to `POST /login`
    - Application verifies credentials
    - Passport reads `session.returnTo` and redirects to `/settings`
4. User's browser follows redirect to `GET /settings`
    - Now authenticated, application renders settings page

## API

### ensureLoggedIn(opts)

opts       |default     |type             |meaning
-----------|------------|-----------------|---------------------------------------
redirectTo |`'/login'`  |string           |URL to redirect to for login
setReturnTo|`true`      |boolean or RegExp|set redirectTo in session, always or when URL matchs the RegExp
baseUrl    |`'/'`       |string           |URL of the base where redirectTo is mounted
setReturnWhenXhr|`false`|boolean          |Include AJAX calls when remember the URL to redirect to

## Tests

    $ npm install --dev
    $ make test

## Credits

  - [Jared Hanson](http://github.com/jaredhanson) for the original
  - [Emilio Platzer](http://github.com/emilioplatzer) for the few enances

## License

[The MIT License](http://opensource.org/licenses/MIT)

### Original version
   * Copyright (c) 2012-2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
