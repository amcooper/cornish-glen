const knex = require("../config/database.js");

const base64decode = serializedId => {
	if (!serializedId) {
		return serializedId
	} else {
		const [tableName, sqlId] = Buffer.from(serializedId, "base64").toString("ascii").split(":");
		console.log("\n[DEBUG][cornish-glen] ", serializedId, tableName, sqlId);
		return sqlId;
	}
}

const getComment = id => {
	return knex("comments").where("id", id);
}

const getCommentsByArticle = articleId => knex("comments").where("article_id", articleId);

const getCommentsQty = () => knex("comments").count("id");

const addComment = ({ body, parentCommentId = undefined, articleId, authorId = 9 }) => {
	// debugger;
	return knex("comments")
		.insert({
			body,
			parent_comment_id: base64decode(parentCommentId),
			article_id: base64decode( articleId ),
			author_id: base64decode( authorId ),
			publication_time: new Date(Date.now()),
			created_at: new Date(Date.now()),
			updated_at: new Date(Date.now())
		});
}

module.exports = {
	getComment,
	getCommentsByArticle,
	getCommentsQty,
	addComment
};
