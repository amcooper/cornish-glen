const { 
  getArticle,
  getArticles
} = require("./Article.js");

const {
  getAuthor,
  getAuthorsByArticle
} = require("./Author.js");

const getTagsByArticle = require("./Tag.js");

module.exports = { 
  getArticle,
  getArticles,
  getAuthor,
  getAuthorsByArticle,
  getTagsByArticle
};