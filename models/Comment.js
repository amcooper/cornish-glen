const knex = require("../config/database.js");

const getComment = id => knex("comments").where("id", id)

// SELECT comments.id, comments.article_id, comments.author_id, users.name FROM comments INNER JOIN users ON comments.author_id = users.id AND comments.article_id = 1;
const getCommentsByArticle = articleId => knex
  .from("comments")
  .innerJoin("users", function() {
    this.on("comments.author_id", "=", "users.id").andOn("comments.article_id", "=", articleId)
  });

module.exports = {
  getComment,
  getCommentsByArticle
};