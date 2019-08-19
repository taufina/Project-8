const express = require('express');
const router = express.Router();
const Book = require("../models").Book; //this lets us use book model and all the associated ORM methodd like CRUD records.
//const dateFormat = require('dateformat');

// // function publishedAt() {
// //   //return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
// // }

// function shortDescription(){ 
//   return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
// }

// const books = [
//   {
//     id: 1,
//     title: "My First Blog Post",
//     author: "Andrew Chalkley",
//     body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu fermentum metus. Sed blandit at sapien sed porttitor. Curabitur libero velit, blandit vel est ut, cursus aliquam augue. Vivamus aliquam, lorem id lobortis blandit, sem quam gravida nibh, a pulvinar nulla lacus eget tortor. Suspendisse cursus, eros non auctor interdum, quam metus sollicitudin est, nec consequat massa nisi sed purus. Aliquam pellentesque sagittis risus vitae porttitor. In dignissim, enim eget pulvinar semper, magna justo vulputate justo, vitae volutpat sapien dolor eget arcu. Mauris ornare ipsum in est molestie pretium. Pellentesque at nulla at libero sagittis condimentum. Pellentesque tempor quis neque eget aliquam. Curabitur facilisis ultricies erat quis sagittis. Sed eu malesuada neque. Donec tempor dignissim urna, eu efficitur felis porttitor quis.",
//     // publishedAt: publishedAt,
//     shortDescription: shortDescription
//   },
//   {
//     id: 2,
//     title: "My Second Blog Post",
//     author: "Andrew Chalkley",
//     body: "Lorem ipsum dolor sit amet, adipiscing elit. Sed eu fermentum metus. Sed blandit at sapien sed porttitor. Curabitur libero velit, blandit vel est ut, cursus aliquam augue. Vivamus aliquam, lorem id lobortis blandit, sem quam gravida nibh, a pulvinar nulla lacus eget tortor. Suspendisse cursus, eros non auctor interdum, quam metus sollicitudin est, nec consequat massa nisi sed purus. Aliquam pellentesque sagittis risus vitae porttitor. In dignissim, enim eget pulvinar semper, magna justo vulputate justo, vitae volutpat sapien dolor eget arcu. Mauris ornare ipsum in est molestie pretium. Pellentesque at nulla at libero sagittis condimentum. Pellentesque tempor quis neque eget aliquam. Curabitur facilisis ultricies erat quis sagittis. Sed eu malesuada neque. Donec tempor dignissim urna, eu efficitur felis porttitor quis.",
//     // publishedAt: publishedAt,
//     shortDescription: shortDescription
//   }
// ];


// function find(id) {
//   const matchedBooks = books.filter(function(book) { return book.id == id; });
//   return matchedBooks[0];
// }


/* GET books listing. */
router.get('/', function(req, res, next) {
  Book.findAll({order: [["title", "ASC"]]}).then(function(books){
    res.render("index", {books: books, title: "My Awesome Library" });
  }).catch(function(err){
    res.send(500);
  });
});
/* POST create book. */
router.post('/', function(req, res, next) {
  Book.create(req.body).then(function(book){
    res.redirect("/books/" + book.id);
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      //render
      res.render("books/new", {
        book: Book.build(req.body), 
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
  //books.push(book);
});

/* Create a new book form. */
router.get('/new', function(req, res, next) {
  res.render("books/new", {book: Book.build(), title: "New Book"});
});

/* Edit book form. */
router.get('/:id/edit', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book) {
      res.render('books/edit', { book: book, title: 'Edit Book' });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* Delete book form. */
router.get('/:id/delete', function (req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      res.render('books/delete', { book: book, title: 'Delete Book' });
    }else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});


/* GET individual book. */
router.get('/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then((book) => {
    if(book){
      res.render('books/show', { book: book, title: book.title });
    } else {
      res.send(404);
    }
  }).catch(function(err){
    res.send(500);
  });
});
// router.get("/:id", function(req, res, next){
//   //const book = find(req.params.id);

//   res.render("books/show", {book: book, title: book.title});
// });



/* PUT update book. */

//updating a method is returning a promsie passes the next value down the then chain.
router.put('/:id', function (req, res, next) {
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
      book. id = req.params.id;

      res.render("books/edit", {
        book: book, 
        title: "Edit Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err){
    res.send(500);
  });
});

/* DELETE individual book. */
router.delete('/:id', function (req, res, next) {
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


module.exports = router;