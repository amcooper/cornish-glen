const { 
	getArticle,
	getArticles
} = require("./Article.js");

const {
	getAuthor,
	getAuthorsByArticle
} = require("./Author.js");

const getTagsByArticle = require("./Tag.js");

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
	getTagsByArticle,
	getCommentsByArticle,
	getCommentsQty,
	addComment,
	getComment
};
