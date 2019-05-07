const knex = require("../config/database.js");

const getCategories = () => knex("categories").orderBy("name");

module.exports = { 
  getCategories
};
