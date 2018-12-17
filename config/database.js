const database = require("../knexfile")[process.env.NODE_ENV];
const knex = require("knex")(database);
module.exports = knex;