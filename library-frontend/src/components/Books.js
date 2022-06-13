import  React, {useState} from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, GENRES} from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const allbooksResult = useQuery(ALL_BOOKS)
  const genresResult = useQuery(GENRES)

  if (!props.show) {
    return null
  }

  if (allbooksResult.loading || genresResult.loading) {
    return <div>Loading...</div>
  }
  const books = allbooksResult.data.allBooks
  const genres = genresResult.data.allBooks
  const uniqueGenres = [...new Set(genres.map(book => book.genres).flat())].concat('all genres')

  const handleFilter = (genre) => {
	setGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>
	  {genre ? <p>in genre <b>{genre}</b></p> : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a => {
			if(a.genres.includes(genre) || !genre || genre === 'all genres') {
				return ( 
				<tr key={a.title}>
					<td>{a.title}</td>
					<td>{a.author.name}</td>
					<td>{a.published}</td>
				</tr>)
		  	}}
          )}
        </tbody>
      </table>
	  {uniqueGenres.map((genre, index) => 
	  	<button key={index} onClick={() => 
			handleFilter(genre)}> {genre}
		</button>)}
    </div>
  )
}

export default Books