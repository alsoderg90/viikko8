import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import Select from 'react-select';
import { ALL_AUTHORS, SET_BORN_YEAR } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const [born, setYear] = useState('')
  const [selectedAuthor, setSelectedAuthor] = useState(null)

  const [ setBornyear ] = useMutation(SET_BORN_YEAR, {
    refetchQueries: [  {query: ALL_AUTHORS} ]
  })

  const result = useQuery(ALL_AUTHORS)

  const submit = async (event) => {
    event.preventDefault()
    setBornyear({ variables: { name: selectedAuthor.value, born: parseInt(born) } })
    setSelectedAuthor(null)
    setYear('')
  }

  if (!props.show) {
    return null
  }


  if (result.loading) {
    return <div>Loading...</div>
  }
  const authors = result.data.allAuthors
  const options = authors.map(author => 
	({ 
	 value: author.name,
	 label: author.name 
	})
  )


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
	  {props.token ? 
	  <>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
      	<Select
			value={selectedAuthor}
			onChange={setSelectedAuthor}
			options={options}
      	/>
		<div>
		born <input value={born} type="number" onChange={(event) =>
			setYear(event.target.value)}></input>
		</div>
		<button type='submit'>Update Author</button>
      </form>
	  </>
	  : null}
    </div>
  )
}

export default Authors
