const knex = require("../config/database.js");

const getCategory = (id) => knex("categories").where("id", id);

const getCategories = () => knex("categories").orderBy("cat_name");

module.exports = { 
  getCategory,
  getCategories
};

