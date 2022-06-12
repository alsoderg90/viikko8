import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS, SET_BORN_YEAR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const [name, setName ] = useState('')
  const [born, setYear] = useState('')

  const [ setBornyear ] = useMutation(SET_BORN_YEAR)

  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000  
  })

  const submit = async (event) => {
	console.log(born, typeof(parseInt(born)))
    event.preventDefault()
    setBornyear({ variables: { name, born: parseInt(born) } })
    setName('')
    setYear('')
  }

  if (!props.show) {
    return null
  }


  if (result.loading) {
    return <div>Loading...</div>
  }
  const authors = result.data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              Born
            </th>
            <th>
              Books
            </th>
          </tr>
          {authors.map(a => {
			return (
			<tr key={a.name}>
				<td>{a.name}</td>
				<td>{a.born}</td>
				<td>{a.bookCount}</td>
			  </tr>
			)
		  }
 
          )}
        </tbody>
      </table>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
          <div>
            name <input value={name} onChange={(event) => 
            setName(event.target.value)}
            />
          </div>
          <div>
            born <input value={born} type="number" onChange={(event) =>
               setYear(event.target.value)}></input>
          </div>
          <button type='submit'>Update Author</button>
      </form>
 



    </div>
  )
}

export default Authors
