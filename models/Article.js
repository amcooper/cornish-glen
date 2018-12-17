const knex = require("../config/database.js");

const ARTICLES_PER_PAGE = 10;

const Article = {
  paginate: () => {
    return knex("articles").orderBy("publication_time", "desc");
  }
}

module.exports = Article;