const chance = require("chance").Chance();

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex("authors_articles").del(),
    knex("articles_tags").del(),
    knex("articles").del(),
    knex("tags").del(),
    knex("authors").del(),
    knex("links").del(),
    knex("categories").del(),
    knex("pages").del()
  ])
  .then(function () {
    // Inserts seed entries
    const articles = [];
    const body = () => {
      const result = "";
      for (let j = (4 + Math.floor(Math.random() * 4)); j > 0; j--) {
        result = result + chance.paragraph() + (j === 1 ? "" : "\n\n");
      }
      return result;
    }
    for (let i = 20; i > 0; i--) {
      articles.push({
        headline: chance.sentence(),
        subhed: chance.sentence(),
        excerpt: "Excerpt " + chance.sentence(),
        image_url: "https://placekitten.com/200/200",
        body: body(),
        publication_time: new Date(Date.now()),
      })
    }
    return Promise.all([
      knex('articles').insert(articles); 
  });
};
