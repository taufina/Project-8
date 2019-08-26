const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); //middleware
const routes = require('./routes/index');
const books = require('./routes/books');
const app = express();

//view engine pug
app.set('view engine', 'pug');

app.use(bodyParser.json());  // set up middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); //using public folder

app.use('/', routes); // using routes folder
app.use('/books', books);  // go to books folder

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('not-found');
});


// error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.locals.message=err.message;
    res.locals.error=err;
    console.error(err);
    res.render('error');
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
