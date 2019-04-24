const chance = require("chance").Chance();
const ARTICLE_SIZE_SPREAD = 4;
const ARTICLE_SIZE_MIN = 4;
const ARTICLE_QTY = 20;
const USERS_QTY = 100;
const AUTHORS_QTY = 7;

const TAG_NAMES = ["webdev", "rust", "privacy", "linux", "random"];

const TAGS_LIST = TAG_NAMES.map(tagName => ({
  name: tagName,
  description: tagName,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}));

const CATEGORY_NAMES = ["tech", "policy", "miscellany", "linguistics", "cartography"];

const CATEGORIES_LIST = CATEGORY_NAMES.map(categoryName => ({
  name: categoryName,
  description: categoryName,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}));

const LINK_DATA = [{
  name: "DuckDuckGo", url: "https://ddg.gg", category_id: 1
}, {
  name: "Democracy Now!", url: "https://democracynow.org", category_id: 2
}, {
  name: "Language Hat", url:"https://languagehat.com", category_id: 5
}, {
  name: "World Socialist Web Site", url: "https://wsws.org", category_id: 2
}, {
  name: "The Intercept", url: "https://theintercept.com", category_id: 2
}];

const LINKS_LIST = LINK_DATA.map(linkItem => ({
  ...linkItem,
  description: linkItem.name,
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now())
}));

const body = () => {
  let result = "";
  for (let j = chance.integer({ min: ARTICLE_SIZE_MIN, max: ARTICLE_SIZE_MIN + ARTICLE_SIZE_SPREAD}); j > 0; j--) {
    result = result + chance.paragraph() + (j === 1 ? "" : "\n");
  }
  return result;
}

const seedArticles = () => {
  const articles = [];
  const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;
  for (let i = ARTICLE_QTY; i > 0; i--) {
    let r = chance.integer({ min: 1, max: ONE_YEAR/ARTICLE_QTY });
    let publication_status = (Math.random() < 0.2) ? "draft" : "published";
    let publication_time = (publication_status === "published") 
      ? new Date(Date.now() - i * (ONE_YEAR/ARTICLE_QTY) + r)
      : undefined;
    articles.push({
      headline: chance.sentence({ words: 5 }).slice(0, -1),
      subhed: chance.sentence({ words: 8 }).slice(0, -1),
      excerpt: "Excerpt " + chance.sentence(),
      image_url: `https://picsum.photos/200/200/?image=${chance.integer({ min: 1, max: 1000 })}`,
      body: body(),
      publication_time,
      publication_status,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    });
  }
  return articles;
}

const seedUsers = () => {
  const users = [];
  for (let i = USERS_QTY; i > 0; i--) {
    const firstName = chance.first();
    const surname = chance.last();
    users.push({
      name: `${firstName} ${surname}`,
      sort_name: surname,
      email: `${firstName.toLowerCase()}.${surname.toLowerCase()}@hotmail.com`,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    });
  }
  return users;
}

const seedAuthorsArticles = () => {
  const result = [];
  for (let k = ARTICLE_QTY; k > 0; k--) {
    const firstCoauthor = chance.integer({ min: 1, max: AUTHORS_QTY });
    result.push({article_id: k, author_id: firstCoauthor});
    if (Math.random() < 0.333) {
      const m = chance.integer({ min: 1, max: AUTHORS_QTY });
      const secondCoauthor = m === firstCoauthor ? (m + 1) % AUTHORS_QTY : m;
      result.push({article_id: k, author_id: secondCoauthor});
    } 
  }
  return result;
}

const seedArticlesTags = () => {
  const result = [];
  for (let m = ARTICLE_QTY; m > 0; m--) {
    for (let n = TAGS_LIST.length; n > 0; n--) {
      if (Math.random() < 0.5) {
        result.push({article_id: m, tag_id: n});
      }
    }
  }
  return result;
}

const seedPages = () => {
  const result = [];
  for (let p = 2; p > 0; p--) {
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

const seedComments = () => {
  const result = [];
  for (let i = ARTICLE_QTY; i > 0; i--) {
    for (let j = 3; j > 0; j--) {
      result.unshift({
        body: chance.sentence(),
        parent_comment_id: undefined,
        publication_time: new Date(Date.now()),
        article_id: i,
        author_id: chance.integer({ min: 7, max: 100 }),
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now())
      });
    }
  }
  const random_comment_index = chance.integer({ min: 0, max: result.length })
  console.log(`***random comment ${random_comment_index}: `, result[ random_comment_index ]);
  return result;
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex("authors_articles").del(),
    knex("articles_tags").del(),
    knex("articles").del(),
    knex("tags").del(),
    knex("users").del(),
    knex("links").del(),
    knex("categories").del(),
    knex("pages").del()
  ])
  .then(function () {
    // Inserts seed entries
    return Promise.all([
      knex("articles").insert(seedArticles()),
      knex("users").insert(seedUsers()),
      knex("tags").insert(TAGS_LIST),
      knex("categories").insert(CATEGORIES_LIST),
      knex("pages").insert(seedPages())
    ])
    .then(() => {
      return Promise.all([
        knex("comments").insert(seedComments()),
        knex("authors_articles").insert(seedAuthorsArticles()),
        knex("articles_tags").insert(seedArticlesTags()),
        knex("links").insert(LINKS_LIST)
      ]);
    })
    .catch(errorInsert => { console.error("insertions ", errorInsert); });
  })
  .catch(error => { console.error("outermost ", error); });
};
