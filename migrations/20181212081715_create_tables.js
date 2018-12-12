
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable("articles").then( exists => {
      if (!exists) {
        return knex.schema.createTable("articles", table => {
          table.increments();
          table.string("headline");
          table.string("subhed");
          table.string("excerpt");
          table.string("imageUrl");
          table.string("body");
          table.string("publicationTime");
          table.string("publicationStatus");
          table.timestamps();
        });
      }
    }),

    knex.schema.hasTable("authors").then( exists => {}),

    knex.schema.hasTable("authors").then( exists => {}),

    knex.schema.hasTable("authors").then( exists => {}),

    knex.schema.hasTable("authors").then( exists => {}),

    knex.schema.hasTable("authors").then( exists => {}),

  ]) 
};

exports.down = function(knex, Promise) {
  
};
