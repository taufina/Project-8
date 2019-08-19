'use strict';

//const dateFormat = require('dateformat');

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
          msg: "Authod is required"
        },
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
  };

  // Book.prototype.publishedAt = function() {
  //   return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
  // };

  // Book.prototype.shortDescription = function() { 
  //   return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
  // };

  return Book;
};

// }, {
//     classMethods: {
//       associate: function(models){
//         //associates can be defined here
//       }
//     },
//     instanceMethods: {
//       publishedAt: function() {
//         return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
//       },      
//       shortDescription: function(){ 
//         return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
//       }
//     }
//   });
  // Book.associate = function(models) {
  //   // associations can be defined here
  // };
//   return Book;
// };