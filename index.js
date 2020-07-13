// require packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser')
const serveStatic = require('serve-static')

// non variable requires
require('dotenv').config()
require('./config/passport')(passport);

// const configs
const port = process.env.PORT || 5555
const site_port = process.env.BASEURL + port

// app configs
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1)
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
      cookie: {expires: new Date(2147483647000)},
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
    })
  );app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(require('express-status-monitor')());
app.use(expressValidator());

// passport initiazation
app.use(passport.initialize());
app.use(passport.session());

// import routes
const writersRoutes = require('./routes/writer')
app.use('/writers', writersRoutes)
const producerRoutes = require('./routes/producer')
app.use('/producers', producerRoutes)
const articleRoutes = require('./routes/article')
app.use('/article', articleRoutes)
const indexRoutes = require('./routes/index')
app.use('/', indexRoutes)
const regRoutes = require('./routes/registration')
app.use('/', regRoutes)
const adminRoutes = require('./routes/admin')
app.use('/admin', adminRoutes)
const redirects = require('./routes/redirects')
app.use('/', redirects)
const userRoutes = require('./routes/user')
app.use('/users', userRoutes)
const videoRoutes = require('./routes/videos')
app.use('/videos', videoRoutes)
const devRoutes = require('./routes/developers')
app.use('/developers', devRoutes)

// error handling
app.use(function(req, res) {
  const about = {
      title: '404 - ' + process.env.NAME,
      templateName: 'errors/404',
      devTest: 'dev_404',
      name: process.env.NAME
  };
  res.status(400)
  return res.render('base', about);
});
app.use(function(req, res) {
  const about = {
      title: '500 - ' + process.env.NAME,
      templateName: 'errors/500',
      devTest: 'dev_500',
      name: process.env.NAME
  };
  res.status(400)
  return res.render('base', about);
});

console.log(`%c \nNodium started, it is running on port ${port} -- ${site_port}`, 'color: blue;')
console.log(`%c The source code is available at: http://github.com/mr-winson/nodium\n`, 'color: red;')
console.info(`%c For info on the site vidit: http://github.com/mr-winson/nodium#readme\n`, 'color: green;')

// mongoose -- database for storing stuff
mongoose
  .connect(
    process.env.DB_HOST,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('\nMongoDB Connected\n'))
  .catch(err => console.log(err));

// reset db everytime npm start is run... development only, not prod
// mongoose.connection.dropDatabase();

// flash error messages WIP
app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// start the server
app.listen(port)