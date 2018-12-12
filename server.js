const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.json("[cornish-glen] Slash route is go");
});

module.exports = app;