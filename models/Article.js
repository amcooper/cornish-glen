const knex = require("../config/database.js");

const getArticle = id => knex("articles")
  .where("id", id)
  .then(data => data[0])
  .catch(error => { console.error(error); });

const getArticles = () => { 
  debugger; 
  return knex("articles"); 
}

module.exports = { 
  getArticle, 
  getArticles
};