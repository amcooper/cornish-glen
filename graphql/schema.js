module.exports = `
  scalar DateTime

  enum PublicationStatus {
    DRAFT
    PUBLISHED
  }

  type Article {
    id: ID!
    headline: String!
    subhed: String
    excerpt: String
    image_url: String
    body: String!
    publication_time: DateTime
    publication_status: PublicationStatus
    created_at: DateTime
    updated_at: DateTime
  }

  type Author {
    id: ID!
    name: String!
    sort_name: String
    email: String
    created_at: DateTime
    updated_at: DateTime
  }

  type Tag {
    id: ID!
    name: String!
    description: String
    created_at: DateTime
    updated_at: DateTime
  }

  type Link {
    id: ID!
    name: String!
    description: String
    url: String!
    category: ID!
    created_at: DateTime
    updated_at: DateTime
  }

  type Category {
    id: ID!
    name: String!
    description: String
    created_at: DateTime
    updated_at: DateTime
  }

  type Page {
    id: ID!
    title: String!
    subtitle: String
    body: String
    publication_time: DateTime
    publication_status: PublicationStatus
    created_at: DateTime
    updated_at: DateTime
  }

  type Query {
    feed(page: Int): [Article]
    article(id: ID!): [Article]
  }
`