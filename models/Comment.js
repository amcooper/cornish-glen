const knex = require("../config/database.js");

const getComment = id => knex("comments").where("id", id)

const getCommentsByArticle = articleId => knex("comments").where("article_id", articleId);

module.exports = {
  getComment,
  getCommentsByArticle
};