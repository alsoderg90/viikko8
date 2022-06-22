
const { UserInputError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const SECRET =  process.env.SECRET;

const resolvers = {
	Query: {
	  bookCount: () => Book.collection.countDocuments(),
	  authorCount: () => Author.collection.countDocuments(),
	  allBooks: async (root, args) => {
		if (args.author && !args.genre) {
		  //return books.filter(book => book.author === args.author)
		  const author = await Author.findOne({ name: args.author })
		  if (author) {
			  return  await Book.find({ author: author.id }).populate('author')
		  }
		  return null
		}
		if (args.genre && !args.author) {
		  //return books.filter(book => book.genres.includes(args.genre))
		  return Book.find({ genres: { $in: [args.genre] } }).populate('author')
		}
		if (args.genre && args.author) {
		  const author = await Author.findOne({ name: args.author })
		  if (author) {
			  return await Book.find({ author: author.id, genres: { $in: [args.genre] } }).populate('author')
		  // return books.filter(book =>
		  //   book.genres.includes(args.genre)).filter(book =>
		  //   book.author === args.author)
			}
		  return null
		}
		else {
		  return await Book.find({}).populate('author')
		}
	  },
	  allAuthors: async () => await Author.find({}),
	  me: (root, args, context) => {
		  return context.currentUser
	  }
  
	},
	Mutation: {
	  addBook: async (root, args, context) => {
		  // if (!authors.find((author) => author.name === args.author)) {
		  //   const newAuthor = {
		  // 	name: args.author,
		  // 	id: uuid(),
		  //   }
		  //   authors = authors.concat(newAuthor)
		  // }
		  // const book = { ...args, id: uuid() }
		  // books = books.concat(book)
		  // return book
		  const currentUser = context.currentUser
		  // if (!currentUser) {
		  // 	console.log("not authenticated")
		  // 	return
		  // }
		  const book = await Book.findOne({ title: args.title })
		  let author = await Author.findOne({ name: args.author.name })
		  if (book) {
			  throw new UserInputError('Book already added', {
				invalidArgs: args.title,
			  })
		  }
		  if (!author) {
			  author = new Author({ name: args.author.name })
			  try {
				await author.save()
			  } catch (error) {
				throw new UserInputError(error.message, {
				  invalidArgs: args,
				})
			  }
			}
			const newBook = new Book({ ...args, author: author  })
	  
			try {
			  await newBook.save()
			} catch (error) {
			  throw new UserInputError(error.message, {
				invalidArgs: args,
			  })
			}
			pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

			return newBook
	  },
	  editAuthor: async (root, args, context) => {
	  // console.log('Author:', args.name, 'Birthyear:', args.born)
	  //   if (!authors.find((author) => author.name === args.name)) return null
	  //   else {
	  // 	authors = authors.map((author) =>
	  //     author.name === args.name
	  //       ? { ...author, name: args.name, born: args.born }
	  //       : author
	  //   )
	  //   return {
	  //     name: args.name,
	  //     born: args.born,
	  //   }
	  // }
		  const currentUser = context.currentUser
  
		  if (!currentUser) {
			console.log("not authenticated")
			return
		  }
		  await Author.updateOne(
			  { name: args.name },
			  { $set: {born: args.born} },
			  {}
		  )
		  return Author.findOne({ name: args.name })
	  },
	  createUser: async (root, args) => {
		  const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})	
		  return user.save()
			.catch(error => {
			  throw new UserInputError(error.message, {
				invalidArgs: args,
			  })
		  })
	  },
	  login: async (root, args) => {
	  const user = await User.findOne({ username: args.username })
  
	  if ( !user || args.password !== 'secret' ) {
		  console.log("wrong credentials")
	  }
  
	  const userForToken = {
		  username: user.username,
		  id: user._id,
	  }
  
	  return { value: jwt.sign(userForToken, SECRET) }
		},
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
	    },  
	},	
	Author: {
	 bookCount: async (root) => {
		const foundAuthor = await Author.findOne({ name: root.name })
		const foundBooks = await Book.find({ author: foundAuthor.id }) 
		return foundBooks.length
	 }
	},
  //   Book: {
  //     title: (root) => root.title,
  //     published: (root) => root.published,
  //     author: (root) => root.author,
  //     id: (root) => root.id,
  //     genres: (root) => root.genres
  //   }
  }

  module.exports = resolvers