
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/Login'
import { useApolloClient } from '@apollo/client'
import FavouriteBooks from './components/FavouriteBooks'



const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const logout = () => {
	    setToken(null)
		localStorage.clear()
	    client.resetStore()  
		setPage('authors')
}

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        {token 
		? <>
		<button onClick={() => setPage('add')}>Add book</button>
		<button onClick={() => setPage('recommended')}>Recommended</button>
		<button onClick={logout}>Logout</button>
		</>
		: <button onClick={() => setPage('login')}>Login</button>
		}
      </div>

	  
      <Authors
        show={page === 'authors'}
		token={token}
      />
      <Books
        show={page === 'books'}
      />
      <LoginForm
		show={page === 'login'}
		setToken={setToken}
		setPage={setPage}
	  />
	  {token ?
	  <>
	  <NewBook
		show={page === 'add'}
      />
	  <FavouriteBooks
	  show={page === 'recommended'}
	/>
	</> 
	: null}
	</div>
  )
}

export default App