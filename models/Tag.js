const knex = require("../config/database.js");

const getTagsByArticle = articleId => knex
  .from("tags")
  .innerJoin("articles_tags", function() {
    this.on("articles_tags.article_id", "=", articleId).andOn("articles_tags.tag_id", "=", "tags.id")
  });

module.exports = getTagsByArticle;