const express = require('express');
const router = express.Router(); //setting the router
const Book = require("../models").Book; //this lets us use book model and all the associated ORM methodd like CRUD records.

/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [["title", "ASC"]]})
  .then(function(books){
    res.render("index", {books: books, title: "Nabila's Library" });
  }).catch(function(err){
    res.send(500, err);
    res.render('errors', {err})
  });
});


/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("new-book", {book: Book.build(), title: "New Book"});
});

/* POST create book. */
router.post('/new', function(req, res, next) {
  let {title, author, genre, year} = req.body;
  Book.create(req.body).then(function(book){
    res.redirect("/books/" + book.id);
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      //render
      res.render("show", {
        // book: Book.build(req.body), 
        // title: "Enter a New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500, err);
    res.render('errors', {err})
  });
  //books.push(book);
});

/* Delete book form. */
router.get('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      res.render('delete', { book: book, title: 'Delete Book' });
    }else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
    res.render('errors', {err})
  });
});



// /* PUT update book. */

// //updating a method is returning a promise passes the next value down the then chain.
router.post('/:id', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      return book.update(req.body);
    } else{
      res.send(404);
    }
  }).then((book) => {
    res.redirect('/books/' + book.id);
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      //render
      const book = Book.build(req.body);
      book.id = req.params.id;

      res.render("update-book", {
        book: req.body, 
        title: "Update Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
    res.render('errors', {err})

  });
});

// /* DELETE individual book. */
router.post('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      return book.destroy();  //destroy method returns a promise, once the promsie is fulfilled, then we redirect to the books path
    }else {
      res.send(404);
      res.render('errors', {err})

    }
  }).then(() => {
    res.redirect('/books');
  }).catch(function(err){
    res.send(500);
    res.render('errors', {err})

  });
});


// /* GET individual book. */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      res.render('show', {book});
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.render('errors', {err})
    res.send(500);
  });
});


// /* Edit book form. */
router.get('/:id/edit', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      res.render('update-book', { book: book, title: 'Edit Book' });
    } else {
      res.render('page-not-found', {err})
    }
  }).catch(function(err){
    res.send(500);
    res.render('errors', {err})
  });
});

module.exports = router;
