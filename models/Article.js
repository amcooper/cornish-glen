const knex = require("../config/database.js");

const getArticle = id => knex("articles").where("id", id);

const getArticles = () => knex("articles")
  .where("publication_status", "published")
  .orderBy("publication_time", "desc");

module.exports = { 
  getArticle, 
  getArticles
};