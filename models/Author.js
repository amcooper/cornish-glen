const knex = require("../config/database.js");

const getAuthor = id => knex("authors")
  .where("id", id)
  .then(data => data[0])
  .catch(error => { console.error(error); });

module.exports = getAuthor;