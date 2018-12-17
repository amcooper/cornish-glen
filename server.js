const express = require("express");
const app = express();
const { buildSchema } = require("graphql");
const morgan = require("morgan");
const graphqlHTTP = require("express-graphql");
const knex = require("./config/database.js");

const schema = buildSchema(require("./graphql/schema.js"));

const { feed } = require("./graphql/queries");

const rootValue = { feed };

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/graphql", express.json(), graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}));

app.get("/", (request, response) => {
  response.json("[cornish-glen] Slash route is go");
});

module.exports = app;