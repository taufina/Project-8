const express = require('express');
const router = express.Router();

/* GET home page. This route should be redirect to the books route */
router.get('/', function(req, res, next) {
  res.redirect("/books")
});

module.exports = router;
