'use strict';
const Sequelize = require("sequelize");


module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "Title is required"
        },
      }
    },
    author: {
      type: DataTypes.STRING,
      validate:{
        notEmpty:{
          msg: "Author is required"
        },
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };


  // Renders the page with all books found based on the current page and search query

  Book.getNumPages = async function(query, perPage) {
    try {
      const Op = Sequelize.Op;
      const totalRecords = await this.count({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: query } },
            { genre: { [Op.substring]: query } },
            { year: { [Op.substring]: query } },
            { author: { [Op.substring]: query } }
          ]
        },
        order: [["title", "ASC"]]
      });
      return Math.ceil(totalRecords / perPage);
    } catch (err) {
      throw new Error("Error getting pages");
    }
  };

//returns all records based on query, pagination, and books per page
  Book.findByQueryAndPagination = async function(
    query,
    booksPerPage,
    currentPage
  ) {
    try {
      const Op = Sequelize.Op;
      return await this.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: query } },
            { genre: { [Op.substring]: query } },
            { year: { [Op.substring]: query } },
            { author: { [Op.substring]: query } }
          ]
        },
        order: [["title", "ASC"]],
        limit: booksPerPage,
        offset: (currentPage - 1) * booksPerPage
      });
    } catch (err) {
      throw err;
    }
  };

  return Book;
};