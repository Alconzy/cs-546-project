var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
var session = require('express-session');

const configRoutes = require("./routes");

var app = express();

// view engine setup
app.engine('html', exphbs({
  layoutsDir: 'views',
  defaultLayout: 'layout',
  extname: '.html',
  helpers: require("./public/javascripts/helper.js").helpers,extname: 'html'
}));

app.set('view engine', 'html');

app.use(session({
  secret: 'keyboard cat',
  cookie: {},
  resave: false,
  saveUninitialized: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// login check handler
app.all('/*', function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    let url = req.url;
    // filter rules
    if (url === '/' || url.search('category') != -1 || url.search('login') != -1
        || url.search('register') != -1 || url.search('search') != -1
        || url.search('detail') != -1 || url.search('forgetpassword') != -1 || url.search('update_new_passoword') != -1) {
      next();
    } else {
      res.redirect('/login.html')
    }
  }
});

configRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
