const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); //middleware
const routes = require('./routes/index');
const books = require('./routes/books');
const app = express();

//const connect = require('connect')
//const methodOverride = require('method-override')
//const favicon = require('serve-favicon');
//const logger = require('morgan');
//const cookieParser = require('cookie-parser');

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(methodOverride('_method'));
//app.use(logger('dev'));
app.use(bodyParser.json());  // setting up middleware
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //using public folder

app.use('/', routes); // using routes folder
app.use('/books', books);  // go to books folder

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err);
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


app.listen(3000, ()=> console.log('running'));
