/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require('dotenv').config();
const express =require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const path = require('path');

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);

// Events for when connection opens/disconnects/errors
mongoose.connection
    .on("open", () => console.log("Connected to Mongoose"))
    .on("close", () => console.log("Disconnected from Mongoose"))
    .on("error", (error) => console.log(error));


////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose using object destructuring
    const { Schema, model } = mongoose;

    const movieSchema = new Schema({
        title: {type: String, required: true},
        releaseDate: String,
        length: Number,
        genre: String,
        poster: {type: String, required: true},
        director: {type: String, required: true},
        rating: String,
        watchAgain: Boolean,
        cast: [{type: String}]
    })

    const Movie = model('Movie', movieSchema);


/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
const app = express();
app.engine('jsx', require('express-react-views').createEngine());
app.set('view engine', 'jsx');


/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // helps us use req.body
app.use(express.static("public")); // serve files from public statically


////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('your server is running... better catch it.');
})

app.get('/movies/seed', (req, res) => {
    const startMovies = [
        {
            title: 'Matrix', 
            releaseDate: '1999',
            length: 136,
            genre: 'Sci-Fi',
            poster: 'https://www.themoviedb.org/t/p/w220_and_h330_face/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
            director: 'Lana and Lily Wachowski',
            rating: 'R',
            watchAgain: true,
            cast: ['Keanu Reeves', 'Lawrence Fishburne', 'Carrie-Anne Moss']
        },
        {
            title: '50 First Dates', 
            releaseDate: '2004',
            length: 99,
            genre: 'Comedy',
            poster: 'https://m.media-amazon.com/images/M/MV5BMjAwMzc4MDgxNF5BMl5BanBnXkFtZTYwNjUwMzE3._V1_FMjpg_UX1000_.jpg',
            director: 'Peter Segal',
            rating: 'PG-13',
            watchAgain: true,
            cast: ['Adam Sandler', 'Drew Barrymore', 'Rob Schneider']
        },
        {
            title: 'The Dark Knight', 
            releaseDate: '2008',
            length: 152,
            genre: 'Action/Adventure',
            poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
            director: 'Christopher Nolan',
            rating: 'PG-13',
            watchAgain: true,
            cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart']
        }
    ]


    // Delete all movies
    Movie.deleteMany({}).then((data) => {
        // Seed Starter Movies
        Movie.create(startMovies).then((data) => {
        // send created movies as response to confirm creation
        res.json(data);
        });
    });
});

// INDEX

// Callback method
// app.get("/fruits", (req, res) => {
//     Fruit.find({}, (err, fruits) => {
//       res.render("fruits/Index", { fruits });
//     });
// });

// .then method
// app.get("/movies", (req, res) => {
//   // find all the fruits
//   Movie.find({})
//     // render a template after they are found
//     .then((movies) => {
//       res.render("movies/Index", { movies });
//     })
//     // send error as json if they aren't
//     .catch((error) => {
//       res.json({ error });
//     });
// });

// INDEX
// Async/await method
app.get("/movies", async (req, res) => {
    try {
      const movies = await Movie.find({});
      res.render("movies/Index", { movies });
    } catch (err) {
      res.json({ err });
    }
  });

// NEW
app.get('/movies/new', (req, res) => {
    res.render('movies/New');
})

// DELETE
app.delete("/movies/:id", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // delete the fruit
    Movie.findByIdAndRemove(id)
      .then((movie) => {
        // redirect to main page after deleting
        res.redirect("/movies");
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
    });
});

//UPDATE
app.put("/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      req.body.watchAgain = req.body.watchAgain === "on" ? true : false;
      req.body.cast = req.body.cast.split(",")
      await Movie.findByIdAndUpdate(id, req.body)
      res.redirect(`/movies/${id}`)
    } catch (error) {
      console.log(error);
      res.json({ error });
    }
})

// CREATE
app.post('/movies', async (req, res) => {
    try {
        req.body.watchAgain = req.body.watchAgain === 'on' ? true : false;
        
        req.body.cast = req.body.cast.split(',');

        const createdMovie = await Movie.create(req.body);
        res.redirect('/movies');
    } catch (err) {
        console.log(err);
        res.json({ err });
    }
})

// EDIT
app.get("/movies/:id/edit", (req, res) => {
    // get the id from params
    const id = req.params.id;
    // get the movie from the database
    Movie.findById(id)
      .then((movie) => {
        // render Edit page and send movie data
        res.render("movies/Edit", { movie });
      })
      // send error as json
      .catch((error) => {
        console.log(error);
        res.json({ error });
      });
  });

// SHOW
app.get('/movies/:id', async (req, res) => {
    const id = req.params.id

    try {
        const movie = await Movie.findById(id);
        res.render('movies/Show', { movie })
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
})
  

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));