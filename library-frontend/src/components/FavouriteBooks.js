import React from 'react'
import { BOOKS_BY_GENRE, ME} from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'

const FavouriteBooks = (props) => { 

	const MeResult = useQuery(ME)
	const [getFavoriteBooks, result] = useLazyQuery(BOOKS_BY_GENRE)

	if (!props.show) {
		return null
	}

	if (MeResult.loading) {
		return <div>Loading...</div>
	}
	const favoriteGenre = MeResult.data.me.favoriteGenre

	getFavoriteBooks(({variables: {genre: favoriteGenre}}))

	return (
		<>
		<h1> Recommendations</h1>
		<p>books in your favorite genre <b>{favoriteGenre}</b> </p>
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
		{result.data?.allBooks.map((book) => 
				<tr key={book.title}>
					<td>{book.title}</td>
					<td>{book.author.name}</td>
					<td>{book.published}</td>
				</tr>
		)}
		</tbody>
		</table>
		</>
	)

}


export default FavouriteBooks