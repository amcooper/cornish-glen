const knex = require("../config/database.js");

const ARTICLES_PER_PAGE = 10;

const Article = {
  index: () => {
    return knex("articles").orderBy("publication_time", "desc");
  },
  lastTen: id => {}
}

module.exports = Article;