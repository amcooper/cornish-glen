// Check this for defaults and cascades

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable("articles").then( exists => {
      if (!exists) {
        return knex.schema.createTable("articles", table => {
          table.increments();
          table.string("headline");
          table.string("subhed");
          table.string("excerpt");
          table.string("image_url");
          table.text("body");
          table.dateTime("publication_time");
          table.enu("publication_status", ["draft", "published"]).defaultTo("draft");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("users").then( exists => {
      if (!exists) {
        return knex.schema.createTable("users", table => {
          table.increments();
          table.string("name");
          table.string("sort_name");
          table.string("email");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("tags").then( exists => {
      if (!exists) {
        return knex.schema.createTable("tags", table => {
          table.increments();
          table.string("name");
          table.string("description");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("authors_articles").then( exists => {
      if (!exists) {
        return knex.schema.createTable("authors_articles", table => {
          table.increments();
          table.integer("author_id").unsigned().notNullable();
          table.integer("article_id").unsigned().notNullable();
          table.foreign("author_id").references("id").inTable("users");
          table.foreign("article_id").references("id").inTable("articles");
        })
      }
    }),

    knex.schema.hasTable("articles_tags").then( exists => {
      if (!exists) {
        return knex.schema.createTable("articles_tags", table => {
          table.increments();
          table.integer("tag_id").unsigned().notNullable();
          table.integer("article_id").unsigned().notNullable();
          table.foreign("tag_id").references("id").inTable("tags");
          table.foreign("article_id").references("id").inTable("articles");
        })
      }
    }),

    knex.schema.hasTable("links").then( exists => {
      if (!exists) {
        return knex.schema.createTable("links", table => {
          table.increments();
          table.string("name");
          table.string("description");
          table.string("url");
          table.integer("category_id").unsigned().notNullable();
          table.foreign("category_id").references("id").inTable("categories");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("categories").then( exists => {
      if (!exists) {
        return knex.schema.createTable("categories", table => {
          table.increments();
          table.string("name");
          table.string("description");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("pages").then( exists => {
      if (!exists) {
        return knex.schema.createTable("pages", table => {
          table.increments();
          table.string("title");
          table.string("subtitle");
          table.text("body");
          table.dateTime("publication_time");
          table.enu("publication_status", ["published", "draft"]).defaultTo("draft");
          table.timestamps();
        });
      }
    }),

  ]) 
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("authors_articles"),
    knex.schema.dropTableIfExists("articles_tags"),
    knex.schema.dropTableIfExists("articles"),
    knex.schema.dropTableIfExists("authors"),
    knex.schema.dropTableIfExists("tags"),
    knex.schema.dropTableIfExists("links"),
    knex.schema.dropTableIfExists("categories"),
    knex.schema.dropTableIfExists("pages")
  ])
};
