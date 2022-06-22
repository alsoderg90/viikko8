const { gql } = require('apollo-server')

const typeDefs = gql`
	type Book {
		title: String!
		published: Int!
		author: Author!
		id: ID!
		genres: [String]
	}

	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}
	  
	type Token {
		value: String!
	}

	input Input {
		name: String!
		born: Int 
	}

	type Mutation {
		addBook(
			title: String!
			published: Int!
			author: Input!
			genres: [String!]
		): Book
		editAuthor(
			name: String!
			born: Int!
		): Author
		createUser(
			username: String!
			favoriteGenre: String!
		  ): User
		login(
			username: String!
			password: String!
		): Token

	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author:String, genre:String): [Book!]!
		allAuthors: [Author!]!
		me: User
	}

	type Subscription {
		bookAdded: Book!
	  }    
`

module.exports = typeDefs