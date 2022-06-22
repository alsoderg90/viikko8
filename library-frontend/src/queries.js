import { gql  } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`
export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
	  author {
		name
	  }
	  genres
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]) {
    addBook(
      title: $title
      published: $published
      author: {
		name: $author
	  }
      genres: $genres
    ) {
    	title
        published
        genres
		author {
			name
		}
    }
  }
`
export const SET_BORN_YEAR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(
        name: $name
        born: $born
  ) {
      name
      born
  	}
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const GENRES = gql`
  query {
    allBooks {
	  genres
	  }
    }
  `

export const BOOKS_BY_GENRE = gql`
  query($genre: String!) {
    allBooks(genre: $genre) {
      title
      published
	  author {
		name
	  }
	  genres
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
	title
	published
	author {
		name
	}
	genres
	}
`

export const BOOK_ADDED = gql`
  subscription {
	bookAdded {
		...BookDetails
	}  
  }  
${BOOK_DETAILS}
`