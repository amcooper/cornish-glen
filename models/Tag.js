const knex = require("../config/database.js");

const getTagsByArticle = articleId => knex
  .from("tags")
  .innerJoin("articles_tags", "articles_tags.article_id", articleId);

module.exports = getTagsByArticle;