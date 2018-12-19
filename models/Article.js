const knex = require("../config/database.js");

export const getArticle = id => knex("articles")
  .where("id", id)
  .then(data => data[0])
  .catch(error => { console.error(error); });
