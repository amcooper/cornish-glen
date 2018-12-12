// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: "postgres://localhost:5432/cornish_glen",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL || "postgres://localhost:5432/cornish_glen",
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
