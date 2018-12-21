const knex = require("../config/database.js");

const getArticle = id => knex("articles")
  .where("id", id)
  .then(data => data[0])
  .catch(error => { console.error(error); });

module.exports = getArticle;