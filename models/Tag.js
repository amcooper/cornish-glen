const knex = require("../config/database.js");

const getTags = () => knex("tags").orderBy("name");

const getTagsByArticle = articleId => knex
  .from("tags")
  .innerJoin("articles_tags", function() {
    this.on("articles_tags.article_id", "=", articleId).andOn("articles_tags.tag_id", "=", "tags.id")
  });

module.exports = { getTags, getTagsByArticle };

