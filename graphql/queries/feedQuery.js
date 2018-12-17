const Article = require("../../models/Article.js");

const feed = (page) => {
  return Article.paginate(page)
    .then(data => {
      debugger;
      return data;
    })
    .catch(error => { console.error(error); });
}

module.exports = feed;