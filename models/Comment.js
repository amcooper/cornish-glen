const knex = require("../config/database.js");

const getComment = id => {
  return knex("comments").where("id", id);
}

const getCommentsByArticle = articleId => knex("comments").where("article_id", articleId);

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