const {
	GraphQLID,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
	GraphQLEnumType,
	GraphQLNonNull
} = require("graphql");

const {
	nodeDefinitions,
	globalIdField,
	fromGlobalId,
	connectionFromArray,
	connectionArgs,
	connectionDefinitions,
	mutationWithClientMutationId,
	offsetToCursor,
} = require("graphql-relay");

const {
	getArticle,
	getArticles,
	getAuthor,
	getAuthorsByArticle,
	getTagsByArticle,
	getCommentsByArticle,
	getCommentsQty,
	getComment,
	addComment
} = require("../models/index.js");

const { nodeInterface, nodeField } = nodeDefinitions(
	globalId => {
		const { type, id } = fromGlobalId(globalId);
		if (type === "Article") {
			return getArticle(id);
		}
		if (type === "Author") {
			return getAuthor(id);
		}
		if (type === "Tag") {
			return getTag(id);
		}
		if (type === "Comment") {
			return getComment(id);
		}
	},
	obj => {
		if (obj.authors) { return articleType }
			else if (obj.name) { return authorType }
			else if (obj.parent_comment_id) { return commentType }
			else { return tagType }
	}
);

const PublicationStatusType = new GraphQLEnumType({
	name: "PublicationStatus",
	description: "Publication status",
	values: {
		DRAFT: { value: "draft" },
		PUBLISHED: { value: "published" }
	}
});

const authorType = new GraphQLObjectType({
	name: 'Author',
	description: 'Author of an article',
	interfaces: [ nodeInterface ],
	fields: () => ({
		id: globalIdField(),
		name: {
			type: GraphQLString,
			description: 'Author\'s name',
		},
		sort_name: {
			type: GraphQLString,
			description: 'The string (usually surname) by which the author\'s name should be sorted',
		},
		email: {
			type: GraphQLString,
			description: 'Author\'s email address'
		}
	})
});

const { connectionType: authorConnection } =
	connectionDefinitions({ nodeType: authorType });

const commentType = new GraphQLObjectType({
	name: 'Comment',
	description: 'Comment',
	interfaces: [ nodeInterface ],
	fields: () => ({
		id: globalIdField(), 
		body: {
			type: GraphQLString,
			description: 'Comment body'
		},
		parent_comment_id: {
			type: GraphQLID,
			description: 'ID of comment being responded to'
		},
		publication_time: {
			type: GraphQLString,
			description: 'Comment publication time'
		},
		author: {
			type: authorType,
			description: 'Commenter',
			resolve: (comment, args) => {
				return getAuthor(comment.author_id)
					.then(author => author[0])
					.catch(error => { console.error(error); });
			}
		}
	})
});

const { 
	connectionType: commentConnection,
	edgeType: GraphQLCommentEdge,
} = connectionDefinitions({ 
	name: 'Comment',
	nodeType: commentType,
});

const tagType = new GraphQLObjectType({
	name: 'Tag',
	description: 'Tag',
	interfaces: [ nodeInterface ],
	fields: () => ({
		id: globalIdField(),
		name: {
			type: GraphQLString,
			description: 'Tag name'
		},
		description: {
			type: GraphQLString,
			description: 'Tag description'
		}
	})
});

const { connectionType: tagConnection } = connectionDefinitions({ nodeType: tagType });

const articleType = new GraphQLObjectType({
	name: 'Article',
	description: 'Article',
	interfaces: [ nodeInterface ],
	fields: () => { 
		return ({
			id: globalIdField(),
			headline: {
				type: GraphQLString,
				description: 'Article headline',
			},
			subhed: {
				type: GraphQLString,
				description: 'Article subhed',
			},
			excerpt: {
				type: GraphQLString,
				description: 'Article excerpt for the promo',
			},
			body: {
				type: GraphQLString,
				description: 'Article body'
			},
			image_url: {
				type: GraphQLString,
				description: 'URL of article promo image'
			},
			publication_time: {
				type: GraphQLString,
				description: 'Article publication timestamp'
			},
			publication_status: {
				type: PublicationStatusType,
				description: 'Article publication status'
			},
			authors: {
				type: authorConnection,
				description: 'Article authors',
				args: connectionArgs,
				resolve: (article, args) => {
					return getAuthorsByArticle(article.id)
						.then(data => {
							// There is probably a cleaner way to do this, preferably by getting cleaner data from db above.
							const authors = data.map(obj => {
								let newObj = Object.assign(obj, {id: obj.author_id});
								delete newObj.author_id;
								delete newObj.article_id;
								return newObj;
							});
							return connectionFromArray(authors, args);
						})
						.catch(error => { console.error(error); });
				}
			},
			tags: {
				type: tagConnection,
				description: 'Article tags',
				args: connectionArgs,
				resolve: (article, args) => {
					// You'll need to check and prob repair the tags array
					return getTagsByArticle(article.id)
						.then(data => {
							const tags = data.map(obj => {
								let newObj = Object.assign(obj, {id: obj.tag_id});
								delete newObj.tag_id;
								delete newObj.article_id;
								return newObj;
							});
							return connectionFromArray(tags, args);
						})
						.catch(error => { console.error(error); });
				}
			},
			comments: {
				type: commentConnection,
				description: 'Article comments',
				args: connectionArgs,
				resolve: (article, args) => {
					return getCommentsByArticle(article.id) 
						.then(comments => {
							return connectionFromArray(comments, args);
						})
						.catch(error => { console.error(error); });
				}
			}
	});
}
});

const { connectionType: articleConnection } = connectionDefinitions({ nodeType: articleType });

const Query = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		articles: {
			type: articleConnection,
			description: 'All the articles',
			args: connectionArgs,
			resolve: (article, args) => { 
				return getArticles()
					.then(data => { return connectionFromArray(data, args); })
					.catch(error => { console.error(error); }); 
			},
		},
		article: {
			type: articleType,
			description: 'Single article',
			args: {
				id: { type: GraphQLID }
			},
			resolve: (article, args) => {
				return getArticle(args.id)
					.then(data => {						 
						return data[0];
					})
					.catch(error => { console.error(error); });
			}
		},
		node: nodeField,
	}),
});

/*
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addTodo: GraphQLAddTodoMutation,
		changeTodoStatus: GraphQLChangeTodoStatusMutation,
		markAllTodos: GraphQLMarkAllTodosMutation,
		removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
		removeTodo: GraphQLRemoveTodoMutation,
		renameTodo: GraphQLRenameTodoMutation,
	},
});
*/

const commentMutation = mutationWithClientMutationId({
	name: "NewComment",
	inputFields: {
		body: {
			type: new GraphQLNonNull(GraphQLString)
		},
		parentCommentId: {
			type: GraphQLID
		},
		articleId: {
			type: new GraphQLNonNull(GraphQLID)
		},
		authorId: {
			type: GraphQLID
		}
	},
	outputFields: {
		commentEdge: {
			type: GraphQLCommentEdge,
			resolve: payload => {					
				return getComment(payload.commentId)
					.then(data => data[0])
					.then(comment => {
						return getCommentsQty()
							.then(commentsQty => {
								return {
									cursor: offsetToCursor( commentsQty - 1 ),
									node: comment,
								}
							})
							.catch(error => { console.error(error); });
					})
					.catch(error => { console.error(error); }); 
			}
		}
	},
	mutateAndGetPayload: ({ body, parentCommentId, articleId, authorId }) => {
		return addComment({ body, parentCommentId, articleId, authorId })
			.then(data => { 
				console.log("[DEBUG][commentMutation][payload] ", data[0], "\n");				
				return ({ commentId: data[0] });
			})
			.catch(error => { console.error(error); });
	}
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		addComment: commentMutation
	})
});

const schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
});

module.exports = schema;
