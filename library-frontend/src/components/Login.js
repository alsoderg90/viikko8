import React, {useState, useEffect} from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = ({show, setToken, setPage}) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [ login, result ] = useMutation(LOGIN, {
	    onError: (error) => {
		console.log(error)
		// setError(error.graphQLErrors[0].message)
	  }
	})
  
	useEffect(() => {
	    if ( result.data ) {
	      const token = result.data.login.value
		  setToken(token)      
		  localStorage.setItem('library-user-token', token)
	    }  
	}, [result.data]) // eslint-disable-lin

	if (!show) {
		return null
	}

	const submit = async (event) => {
		event.preventDefault()
		login({ variables: { username, password } })
		setPage("authors")
	}

	return (
	  <div>
		<form onSubmit={submit}>
		  <h2>Log in to application</h2>
		  <div> Username
			<input
			  id='username'
			  type ="username"
			  value={username}
			  name='Username'
			  onChange = {({target}) => setUsername(target.value)}
			/>
		  </div>
		  <div> Password
			<input
			  id='password'
			  type = "password"
			  value = {password}
			  name = "password"
			  onChange = {({target}) => setPassword(target.value)}
			/>
		  </div>
		  <button id='login-button' type="submit">Login</button>
		</form>
	  </div>
	)
  }
   
  export default LoginForm