const chance = require("chance").Chance();
const ARTICLE_SIZE_SPREAD = 4;
const ARTICLE_SIZE_MIN = 4;
const ARTICLE_QTY = 20;
const AUTHORS_LIST = [{
  name: "T. T. Olafua",
  sort_name: "olafua",
  email: "tt@olafua.com",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "F. A. Renteria",
  sort_name: "renteria",
  email: "nachosplease@renteria.media",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}];

const TAGS_LIST = [{
  name: "webdev",
  description: "webdev",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "rust",
  description: "rust",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "privacy",
  description: "privacy",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "linux",
  description: "linux",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "random",
  description: "random",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}];

const LINKS_LIST = [{
  name: "DuckDuckGo",
  description: "DuckDuckGo",
  url: "https://ddg.gg",
  category_id: 1,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, {
  name: "Democracy Now!",
  description: "DN",
  url: "https://democracynow.org",
  category_id: 2,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}];

const CATEGORIES_LIST = [{
  name: "tech", description: "tech",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}, { 
  name: "policy", description: "policy",
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}];

const body = () => {
  let result = "";
  for (let j = (ARTICLE_SIZE_MIN + Math.floor(Math.random() * ARTICLE_SIZE_SPREAD)); j > 0; j--) {
    result = result + chance.paragraph() + (j === 1 ? "" : "\n");
  }
  return result;
}

const seedArticles = () => {
  const articles = [];
  for (let i = ARTICLE_QTY; i > 0; i--) {
    articles.push({
      headline: chance.sentence(),
      subhed: chance.sentence(),
      excerpt: "Excerpt " + chance.sentence(),
      image_url: `https://picsum.photos/200/200/?image=${Math.floor(Math.random() * 1000) + 1}`,
      body: body(),
      // publication_time: new Date(Date.now()),
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    });
  }
  return articles;
}

const seedAuthorsArticles = () => {
  const result = [];
  let die;
  for (k = ARTICLE_QTY; k > 0; k--) {
    die = Math.floor(Math.random() * AUTHORS_LIST.length) + 1;
    if (die === 0) {
      result.push({article_id: k, author_id: 1});
      result.push({article_id: k, author_id: 2});
    } else {
      result.push({article_id: k, author_id: die});
    }
  }
  return result;
}

const seedArticlesTags = () => {
  const result = [];
  for (m = ARTICLE_QTY; m > 0; m--) {
    for (n = TAGS_LIST.length; n > 0; n--) {
      if (Math.floor(Math.random() < 0.5)) {
        result.push({article_id: m, tag_id: n});
      }
    }
  }
  return result;
}

const seedPages = () => {
  const result = [];
  for (p = 2; p > 0; p--) {
    result.push({
      title: chance.sentence(),
      subtitle: chance.sentence(),
      body: body(),
      // publication_time: chance.timestamp()
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    });
  }
  return result;
}

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
    return Promise.all([
      knex('articles').insert(seedArticles()),
      knex("authors").insert(AUTHORS_LIST),
      knex("tags").insert(TAGS_LIST),
      knex("categories").insert(CATEGORIES_LIST),
      knex("pages").insert(seedPages())
    ])
    .then(() => {
      return Promise.all([
        knex("authors_articles").insert(seedAuthorsArticles()),
        knex("articles_tags").insert(seedArticlesTags()),
        knex("links").insert(LINKS_LIST)
      ]);
    });
  });
};
