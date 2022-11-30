const React = require('react');
const DefaultLayout = require('../Default');

class New extends React.Component {
    render() {
        return(
            <DefaultLayout>
                <form action="/movies" method="post">
                    <fieldset>
                    <legend>Create a New Movie</legend>
                    <label>
                        Title:<input type="text" name="title" placeholder="enter movie title" />
                    </label>
                    <label>
                        Genre:<input type="text" name="genre" placeholder="enter genre" />
                    </label>
                    <label> Release Date:<input type="text" name="releaseDate" /> </label>
                    <label> Length:<input type="number" name="length" /> </label>
                    <label> Poster:<input type="text" name="poster" /> </label>
                    <label> Director:<input type="text" name="director" /> </label>
                    <label> Rating:<input type="text" name="rating" /> </label>
                    <label> Cast:<input type="text" name="cast" /> </label>
                    <label> Watch Again:<input type="checkbox" name="watchAgain" /> </label>
                    </fieldset>
                    <input type="submit" value="create new movie" />
                </form>
            </DefaultLayout>
        )
    }
}

module.exports = New;