const {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLEnumType
} = require("graphql");

const {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
} = require("graphql-relay");

const {
  getArticle,
  getArticles,
  getAuthor,
  getAuthorsByArticle,
  getTagsByArticle,
  getCommentsByArticle
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
  },
  obj => {
    if (obj.authors) { return articleType }
      else if (obj.name) { return authorType }
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
            .then(authors => connectionFromArray(authors, args))
            .catch(error => { console.error(error); });
        }
      },
      tags: {
        type: tagConnection,
        description: 'Article tags',
        args: connectionArgs,
        resolve: (article, args) => {
          return getTagsByArticle(article.id)
            .then(tags => connectionFromArray(tags, args))
            .catch(error => { console.error(error); });
        }
      },
      comments: {
        type: commentConnection,
        description: 'Article comments',
        args: connectionArgs,
        resolve: (article, args) => {
          return getCommentsByArticle(article.id) 
            .then(comments => connectionFromArray(comments, args))
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
          .then(data => data[0])
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

const schema = new GraphQLSchema({
  query: Query,
  // mutation: Mutation,
});

module.exports = schema;
