const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const { printSchema } = require("graphql");
const graphqlHTTP = require("express-graphql");

const schema = require("./graphql/schema.js");
console.log(printSchema(schema));
const { feed } = require("./graphql/queries");

const rootValue = { feed };

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.options("/graphql", cors()); // CORS pre-flight
app.use("/graphql", express.json(), graphqlHTTP({
  schema,
  // rootValue,
  graphiql: true
}));

app.get("/", (request, response) => {
  response.json("[cornish-glen] Slash route is go");
});

module.exports = app;
