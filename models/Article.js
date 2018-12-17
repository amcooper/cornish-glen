const knex = require("../config/database.js");

const ARTICLES_PER_PAGE = 10;

const Article = {
  paginate: page => {
    debugger;
    return knex("articles").orderBy("publication_time", "desc");
  }
}

module.exports = Article;