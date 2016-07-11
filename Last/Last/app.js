var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var tmap = require('./routes/Tmap');
var station = require('./routes/Station');
var gcm = require('./routes/gcm_provider');
var login = require('./routes/Login');
var rent = require('./routes/Rent');
var bike = require('./routes/Bike');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/Tmap', tmap);
app.use('/Station', station);
app.use('/Push', gcm);
app.use('/Login', login);
app.use('/Rent',rent);
app.use('/Bike',bike);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
