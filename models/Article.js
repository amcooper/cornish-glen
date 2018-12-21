const knex = require("../config/database.js");

const getArticle = id => knex("articles")
  .where("id", id)
  .then(data => data[0])
  .catch(error => { console.error(error); });

const getArticles = () => { 
  debugger; 
  return knex("articles")
    .then(data => { console.log(data[0]); return data;})
    .catch(error => { console.error(error); }); 
}

module.exports = { 
  getArticle, 
  getArticles
};