const knex = require("../config/database.js");

const getAuthor = id => knex("authors").where("id", id)

const getAuthorsByArticle = articleId => knex
  .from("authors")
  // .innerJoin("authors_articles", "authors_articles.article_id", articleId);
  .innerJoin("authors_articles", function() {
    this.on("authors_articles.article_id", "=", articleId).andOn("authors.id", "=", "authors_articles.author_id")
  })
// should be equivalent to : SELECT authors_articles.article_id, authors.name FROM authors_articles JOIN authors ON authors.id = authors_articles.author_id AND authors_articles.article_id = 2;
module.exports = {
  getAuthor,
  getAuthorsByArticle
};