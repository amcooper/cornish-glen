const knex = require("../config/database.js");

const getAuthor = id => knex("authors").where("id", id)

const getAuthorsByArticle = articleId => knex.
  from("authors")
  .innerJoin("authors_articles", "authors_articles.article_id", articleId);
// SELECT authors.name, authors_articles.article_id FROM authors JOIN authors_articles ON authors_articles.article_id = 1;
module.exports = {
  getAuthor,
  getAuthorsByArticle
};