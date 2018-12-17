const Article = require("../../models/Article.js");

const feed = () => {
  return Article.index()
    .then(data => {
      return data;
    })
    .catch(error => { console.error(error); });
}

module.exports = feed;