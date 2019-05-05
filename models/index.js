const { 
	getArticle,
	getArticles
} = require("./Article.js");

const {
	getAuthor,
	getAuthorsByArticle
} = require("./Author.js");

const { 
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
  getTags,
	getTagsByArticle,
	getCommentsByArticle,
	getCommentsQty,
	addComment,
	getComment
};
