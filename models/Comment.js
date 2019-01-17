const knex = require("../config/database.js");

const getComment = id => {
  debugger;
  return knex("comments").where("id", id);
}

// SELECT comments.id, comments.article_id, comments.author_id, users.name FROM comments INNER JOIN users ON comments.author_id = users.id AND comments.article_id = 1;
const getCommentsByArticle = articleId => knex
  .from("comments")
  .innerJoin("users", function() {
    this.on("comments.author_id", "=", "users.id").andOn("comments.article_id", "=", articleId)
  });

const addComment = ({ body, parentCommentId = undefined, articleId, authorId = 9 }) => knex("comments")
  .insert({
    body,
    parent_comment_id: parentCommentId,
    article_id: articleId,
    author_id: authorId,
    publication_time: new Date(Date.now()),
    created_at: new Date(Date.now()),
    updated_at: new Date(Date.now())
  });

module.exports = {
  getComment,
  getCommentsByArticle,
  addComment
};