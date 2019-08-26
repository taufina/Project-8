const express = require('express');
const router = express.Router(); //setting the router
const Book = require("../models").Book; //this lets us use book model and all the associated ORM methodd like CRUD records.
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//Create sequelize instance

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

// router.get('/', function(req, res, next) {
//   Book.findAll({order: [["title", "ASC"]]}) 
//   .then(function(books){
//     res.render("index", {books: books, title: "Nabila's Library" });
//   }).catch(function(err){
//     err.statusCode = err.statusCode || 500;
//     throw err;
//   });
// });

/* GET books listing in the home page. */

router.get("/", async (req, res, next) => {
  try {
    const booksPerPage = 5;
    const query = req.query.query ? req.query.query : "";
    const numPages = await Book.getNumPages(query, booksPerPage);
    const activePage = req.query.page ? parseInt(req.query.page): (numPages === 0 ? 0: 1);
    if (activePage > numPages || activePage < 0) {
      return next();
    }
    const books = await Book.findByQueryAndPagination(
      query,
      booksPerPage,
      activePage
    );
    res.locals.books = books;
    res.locals.title = "My Library";
    res.locals.pages = numPages;
    res.locals.query = query;
    res.locals.activePage = activePage;
    res.render("index");
  } catch (err) {
    res.render('not-found');

    return next(err);
  }
});

// Search book 
router.get('/search', (req, res) => {
  let query = req.query.search.toLowerCase();

  Book.findAll({
    where: {
      [Op.or]: [
        sequelize.where(
          sequelize.fn('lower', sequelize.col('title')),
          { [Op.like]: '%' + query + '%' },
        ),
        sequelize.where(
          sequelize.fn('lower', sequelize.col('author')),
          { [Op.like]: '%' + query + '%' },
        ),
        sequelize.where(
          sequelize.fn('lower', sequelize.col('genre')),
          { [Op.like]: '%' + query + '%' },
        ),
        sequelize.where(
          sequelize.fn('lower', sequelize.col('year')),
          { [Op.like]: '%' + query + '%' },
        )
      ]
    }
  }).then(books => res.render('index', { books }));
});

/* Create a new book form. */
router.get('/new', function(req, res) {
  res.render("new-book", {book: Book.build(), title: "New Book"});
});

/* Posts a new book to the database */
router.post('/new', function(req, res, next) {
  Book.create(req.body).then(function(book){
    res.redirect("/books/" + book.id);
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render("new-book", {
        book: Book.build(req.body), 
        title: "Enter a New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.render('error', {message: err.message, error: err});
  });
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
  });
});


// /* Edit book form. */
router.get('/:id/edit', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      res.render('update-book', { book: book, title: 'Edit Book' });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});


// /* Post update book. */

// //updating a method is returning a promise passes the next value down the then chain.
router.post('/:id/edit', function (req, res, next) {
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
    res.render('error', {err})

  });
});

// /* DELETE individual book. */
router.post('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      return book.destroy();  //destroy method returns a promise, once the promsie is fulfilled, then we redirect to the books path
    }else {
      res.send(404);
    }
  }).then(() => {
    res.redirect('/books');
  }).catch(function(err){
    res.send(500);
  });
});


// /* GET individual book. */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      res.render('show', {book, title: book.title});
    } else {
      res.send(404);
      console.log("This book does not exist.");
    }
  }).catch(function(err){
    res.render('not-found');
    res.send(500);
  });
});



  // Book.count().then(c => {
  //   booksLength = c;
  // }).then(()=> {
  //   Book.findAll(paginate(pageNumber, numberOfItems)).then(books=>{
  //     const numberOfPages = Math.ceil(booksLength/numberOfItems);
  //     res.render('index', {books, numberOfPages, page});
  //   });
  // });


module.exports = router;
