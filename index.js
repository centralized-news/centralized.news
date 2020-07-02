// require packages
const express = require('express'); 
const app = express();
const path = require('path');
const flash = require('connect-flash');
require('dotenv').config()

// const configs
const port = process.env.PORT || 5555
const site_port = process.env.BASEURL + port

// app configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.get('/', function(req, res, next) {
  const about = {
    title: 'Home - ' + process.env.NAME,
    templateName: 'public/index',
    devTest: 'dev_test',
    name: process.env.NAME
  };
  return res.render('base', about);
});

console.log(`running on port ${port} -- ${site_port}`)

app.listen(port)