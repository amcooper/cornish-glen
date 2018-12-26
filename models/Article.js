const knex = require("../config/database.js");

const getArticle = id => knex("articles").where("id", id);

const getArticles = () => knex("articles");

module.exports = { 
  getArticle, 
  getArticles
};