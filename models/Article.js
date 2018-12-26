const knex = require("../config/database.js");

const getArticle = id => knex("articles").where("id", id);

const getArticles = () => knex("articles").orderBy("publication_time", "desc");

module.exports = { 
  getArticle, 
  getArticles
};