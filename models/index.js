const { 
  getArticle,
  getArticles
} = require("./Article.js");
const {
  getAuthor,
  getAuthorsByArticle
} = require("./Author.js");
const getTag = {};

module.exports = { 
  getArticle,
  getArticles,
  getAuthor,
  getAuthorsByArticle,
  getTag
};