var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//So we have mongoose available everytime we access route
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/onlinefood');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
var menu = require('./routes/menu');
var cart = require('./routes/cart');
var user = require('./routes/user');
var cartpage = require('./routes/cartpage');
var loginpage = require('./routes/loginpage');
var checkoutpage = require('./routes/checkoutpage');

app.use('/', index);
app.use('/cartpage', cartpage);
app.use('/loginpage', loginpage);
app.use('/checkoutpage', checkoutpage);
app.use('/menu', menu);
app.use('/cart', cart);
app.use('/user', user)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
