const knex = require("../config/database.js");

const getCategory = (id) => knex("categories").where("id", id);

const getCategories = () => knex("categories").orderBy("name");

module.exports = { 
  getCategory,
  getCategories
};
