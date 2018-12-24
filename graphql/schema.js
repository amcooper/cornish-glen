const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
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
  getTagsByArticle
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
    debugger; 
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
        debugger; 
        return getArticles()
          .then(data => { console.log(data[0]); return connectionFromArray(data, args); })
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
        debugger;
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

/*
 * Old schema
 * 
module.exports = `
  # scalar DateTime

  enum PublicationStatus {
    DRAFT
    PUBLISHED
  }

  type Article {
    id: ID!
    headline: String!
    subhed: String
    excerpt: String
    authors: [Author]
    tags: [Tag]
    image_url: String
    body: String!
    publication_time: String
    publication_status: PublicationStatus
    created_at: String
    updated_at: String
  }

  type Author {
    id: ID!
    name: String!
    sort_name: String
    email: String
    articles: [Article]
    created_at: String
    updated_at: String
  }

  type Tag {
    id: ID!
    name: String!
    description: String
    articles: [Article]
    created_at: String
    updated_at: String
  }

  type Link {
    id: ID!
    name: String!
    description: String
    url: String!
    category: Category 
    created_at: String
    updated_at: String
  }

  type Category {
    id: ID!
    name: String!
    description: String
    links: [Link]
    created_at: String
    updated_at: String
  }

  type Page {
    id: ID!
    title: String!
    subtitle: String
    body: String
    publication_time: String
    publication_status: PublicationStatus
    created_at: String
    updated_at: String
  }

  type Query {
    feed(last: Int): [Article]
  }
`
*/
/*
 * New Relay-compatible schema
 * 

enum PublicationStatus {
  DRAFT
  PUBLISHED
}

interface Node {
  id: ID!
}

type Article : Node {
  id: ID!
  headline: String
  subhed: String
  excerpt: String
  body: String
  image_url: String
  publication_time: String
  publication_status: PublicationStatus
  created_at: String
  updated_at: String
  authors: ArticleAuthorConnection
  tags: ArticleTagConnection
  comments: ArticleCommentConnection
}

type Author : Node {
  id: ID!
  name: String
  sort_name: String
  email: String
  created_at: String
  updated_at: String
  articles: AuthorArticleConnection
  comments: AuthorCommentConnection
}

type Tag : Node {
  id: ID!
  name: String
  description: String
  created_at: String
  updated_at: String
  articles: TagArticleConnection
}


type Link : Node {
  id: ID!
  name: String
  description: String
  url: String
  created_at: String
  updated_at: String
}

type Category : Node {
  id: ID!
  name: String
  description: String
  created_at: String
  updated_at: String
  links: LinkConnection
}

type Page : Node {
  id: ID!
  title: String!
  subtitle: String
  body: String
  publication_time: String
  publication_status: PublicationStatus
  created_at: String
  updated_at: String
}

type Comment : Node {
  id: ID!
  body: String
  publication_time: String
  publication_status: PublicationStatus
  created_at: String
  updated_at: String
}

type ArticleAuthorConnection {
  edges: [ArticleAuthorEdge]
  pageInfo: PageInfo!
}

type ArticleAuthorEdge {
  cursor: String!
  node: Author
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  articles: [Article]
  comments(articleId: ID!): [Comment]
  categories: [Category]
  pages: [Page]
  page(id: ID!): Page
  node(id: ID!): Node
}

*/

/*
 * Old schema
 * 
module.exports = `
  # scalar DateTime

  enum PublicationStatus {
    DRAFT
    PUBLISHED
  }

  type Article {
    id: ID!
    headline: String!
    subhed: String
    excerpt: String
    authors: [Author]
    tags: [Tag]
    image_url: String
    body: String!
    publication_time: String
    publication_status: PublicationStatus
    created_at: String
    updated_at: String
  }

  type Author {
    id: ID!
    name: String!
    sort_name: String
    email: String
    articles: [Article]
    created_at: String
    updated_at: String
  }

  type Tag {
    id: ID!
    name: String!
    description: String
    articles: [Article]
    created_at: String
    updated_at: String
  }

  type Link {
    id: ID!
    name: String!
    description: String
    url: String!
    category: Category 
    created_at: String
    updated_at: String
  }

  type Category {
    id: ID!
    name: String!
    description: String
    links: [Link]
    created_at: String
    updated_at: String
  }

  type Page {
    id: ID!
    title: String!
    subtitle: String
    body: String
    publication_time: String
    publication_status: PublicationStatus
    created_at: String
    updated_at: String
  }

  type Query {
    feed(last: Int): [Article]
  }
`
*/