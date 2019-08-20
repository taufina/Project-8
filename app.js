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
app.set('views', path.join(__dirname, 'views'));
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
  const err = new Error('Not Found');
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



// const express = require("express");
// const path = require('path');
// const favicon = require('serve-favicon');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
// const connect = require('connect')
// const methodOverride = require('method-override')

// const routes = require('./routes/index');
// const articles = require('./routes/articles');

// const app = express();
// const app = express();
// //connect to SQLite database.
// const Sequelize = require('sequelize');  //include sequelize in program
// const sequelize = new Sequelize({
//     dialect: 'sqlite',  //the sql dialect of the database
//     storage: 'books.db'  //file path or the storage engine
// }); 

// // Movie model
// class Book extends Sequelize.Model {} //defining a Book model

// //initializing the model.  defines a new table in the database
// Book.init({
//     title: Sequalize.String,
//     author: Sequalize.String,
//     genre: Sequalize.String,
//     year: Sequalize.Integer



// }, { sequelize }); 

// // async IIFE 
// //1. define the async function
// //2. try...catch method 
// (async () => {
//     // Sync 'Movies' table
//          //automatically create and update all the tables in the database.
//          //drop a table that exists, each time you start your app, and recreate it from the model definition.drop a table that exists, each time you start your app, and recreate it from the model definition.
//          await Book.sync({ force: true });

//     try{
//         //this tests if the connection is okay.
//         //await sequelize.authenticate();
        
//         //create a record
//         const book = await Book.create(
//             title: 'Toy Story',

//         ); 
//         console.log(book.toJSON());
        
//         console.log('Connection to the database successful!');
//     } catch(error){
//         console.error('Error connecting to the database: ', error);
//     }
// })();

// app.set('view engine', 'pug');

// app.get('/', (req, res)=>{
//     res.redirect('/books');
// });

// app.get('/books', (req, res)=>{
//     res.render('index');
// });

// app.get('/books/new', (req, res)=> {
//     res.render('new-book');
// });

// app.post('/books/new', (req, res)=> {
//     //res.render('about');
// });

// app.get('/books:id', (req, res)=> {
//     res.render('layout');
// });

// app.post('/books:id', (req, res)=> {
//     //res.render('layout');
// });

// app.post('/books:id/delete', (req, res)=> {
//     //res.render('layout');
// });

app.listen(3000, ()=> console.log('running'));
