// require packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const flash = require('connect-flash');
require('dotenv').config()

// const configs
const port = process.env.PORT || 5555
const site_port = process.env.BASEURL + port

// app configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(require('express-status-monitor')());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// import routes
const writersRoutes = require('./routes/writer')
app.use('/writers', writersRoutes)
const articleRoutes = require('./routes/article')
app.use('/article', articleRoutes)
const indexRoutes = require('./routes/index')
app.use('/', indexRoutes)

console.log(`running on port ${port} -- ${site_port}`)

// mongoose
mongoose.connect(
    process.env.DB_HOST,
    {   useNewUrlParser: true,
        useUnifiedTopology: true  },
    () => console.log('connected to DB')
)

// start a server
app.listen(port)