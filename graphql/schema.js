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