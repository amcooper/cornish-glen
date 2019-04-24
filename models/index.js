const { 
	getArticle,
	getArticles
} = require("./Article.js");

const {
	getAuthor,
	getAuthorsByArticle
} = require("./Author.js");

const {
  getTag,
  getTags,
  getTagsByArticle
} = require("./Tag.js");

const {
	getCommentsByArticle,
	getCommentsQty,
	addComment,
	getComment
} = require("./Comment.js");

module.exports = { 
	getArticle,
	getArticles,
	getAuthor,
	getAuthorsByArticle,
  getTag,
  getTags,
	getTagsByArticle,
	getCommentsByArticle,
	getCommentsQty,
	addComment,
	getComment
};
