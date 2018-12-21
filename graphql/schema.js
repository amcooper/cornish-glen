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
  getAuthor,
  getTag,
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

const { connectionType: authorConnection } =
  connectionDefinitions({ nodeType: authorType });

const articleType = new GraphQLObjectType({
  name: 'Article',
  description: 'Article',
  interfaces: [ nodeInterface ],
  fields: () => ({
    id: globalIdField(),
    headline: {
      type: GraphQLString,
      description: 'Article headline',
    },
    subhed: {
      type: GraphQLString,
      description: 'Arricle subhed',
    },
    excerpt: {
      type: GraphQLString,
      description: 'Arricle excerpt for the promo',
    },
    body: {
      type: GraphQLString,
      description: 'Article body'
    },
    authors: {
      type: authorConnection,
      description: 'Article authors',
      args: connectionArgs,
      resolve: (article, args) => connectionFromArray(article.authors.map(getAuthor), args)
    }
  })
});


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