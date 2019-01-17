const knex = require("../config/database.js");

const getAuthor = id => knex("users").where("id", id)

// SELECT authors_articles.article_id, authors.name FROM authors_articles JOIN users ON users.id = authors_articles.author_id AND authors_articles.article_id = 2;
const getAuthorsByArticle = articleId => knex
  .from("users")
  .innerJoin("authors_articles", function() {
    this.on("authors_articles.article_id", "=", articleId).andOn("users.id", "=", "authors_articles.author_id")
  });

module.exports = {
  getAuthor,
  getAuthorsByArticle
};