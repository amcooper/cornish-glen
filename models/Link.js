const knex = require("../config/database.js");

const getLinksByCategory = categoryId => knex("links").where("category_id", categoryId);

module.exports = {
	getLinksByCategory
};

