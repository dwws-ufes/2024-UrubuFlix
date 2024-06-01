import express from 'express' 
import cors from 'cors' 
import bcrypt from 'bcrypt'
import prisma from './services/prisma.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'
import fs from 'fs'

import * as userServices from './services/userServices.js';
import * as catalogServices from './services/catalogServices.js';
import * as movieServices from './services/movieServices.js';
import * as genreENUM from './enum/genreENUM.js';
import * as reviewServices from './services/reviewServices.js';
import { exit } from 'process'

dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

const PORT = process.env.PORT || 3002;


const filePathMoviesJSON = './script_movies/movies.json';// Caminho do arquivo JSON com os filmes FIQUE ATENTO PARA O CAMINHO CORRETO


// Verifica se a conexão com o banco de dados foi estabelecida
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  try {
    // Verifica se a conexão com o banco de dados foi estabelecida
    await prisma.$connect();
    console.log('Connected to the database');

  } 
  catch (error) {
    console.error('Error connecting to the database:', error);
    exit(1);
  }
  try{
    await genreENUM.initializeGenres();
    console.log('Genres initialized');
  }
  catch (error) {
    console.error('Error initializing genres:', error);
  }
  try{
    await movieServices.initializeMovies(filePathMoviesJSON);
  }
  catch (error) {
    console.error('Error initializing movies:', error);
  }
  try{
    await catalogServices.initializeCatalogs();
  }
  catch (error) {
    console.error('Error initializing catalogs:', error);
  }
});


//Register 
app.post('/register', async (req, res) => {
  userServices.register(req,res);
  return res;
});

//Login 
app.post('/login', async (req, res) => {
  userServices.login(req,res);
  console.log(res.message)
  return res;
  
});

//forgot password
app.post('/forgotPassword', async (req, res) => {
  userServices.forgotPassword(req,res);
  return res;
})

//reset password
app.post('/resetPassword/:token', async (req,res) => {
  userServices.resetPassword(req,res);
  return res;
})


app.get("/verify", userServices.verifyUser, (req,res) => {
  return res.json({status: true, message: "authorized", user: req.user})
})

app.get('/logout', (req,res) => {
  res.clearCookie('token')
  
  return res.json({status : true})
})

app.delete('/delete', async (req, res) => {
    userServices.deleteUser(req,res);
    return res;
})


// <---------------------- ROTAS DE FILMES E CATÁLOGOS ---------------------->
app.get('/films', async (req, res) => {
  const movies = await movieServices.getAllMovies();
  res.json(movies);

});

app.get('/films/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid movie ID' });
    return;
  }
  const movie = await movieServices.findMovieById(id);
  res.json(movie);
});



// <---------------------- ROTAS DE GENEROS (PAGE CATEGORIAS) ------------------>
app.get('/catalogs', async (req, res) => {
  const catalogs = await catalogServices.getAllCatalogs();
  res.json(catalogs);
});

app.get('/catalogs/:name', async (req, res) => {
  const name = req.params.name;
  const catalog = await catalogServices.findCatalogName(name);
  res.json(catalog);
});




app.post('/review',userServices.verifyUser, async (req, res) => {
  const { rating, comments, filmId } = req.body;
  const userId = req.user.id;
  const data = { userId, movieId: filmId, rating, comments };

  try {
    const review = await reviewServices.createReview(data);
    return res.json(review);
  }
  catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Error creating review' });
  }
});

app.get('/reviewid/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid review ID' });
    return;
  }
  const review = await reviewServices.findReviewById(id);
  return res.json(review);
});


//retorna todas as reviews de um usuario
app.get('/reviewuser/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }
  const reviews = await reviewServices.findReviewByUser(id);
  return res.json(reviews);
});

//retorna todas as reviews de um filme
app.get('/reviewMovie/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid movie ID' });
    return;
  }
  const reviews = await reviewServices.findReviewByMovie(id);
  return res.json(reviews);
});

// <---------------------- ROTAS DE USUÁRIOS ------------------>
app.get('/users', async (req, res) => {
  const users = await userServices.getAllUsers();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }
  const user = await userServices.findUserById(id);
  res.json(user);
});


app.post('/addFavorite', userServices.verifyUser, async (req, res) => {
  const movieId = req.body.filmId;
  const userId = req.user.id;
  req.body.userId = userId;
  req.body.movieId = movieId;
  await userServices.addFavorite(req,res);
})

app.delete('/removeFavorite', userServices.verifyUser, async (req, res) => {
  const movieId = req.body.filmId;
  const userId = req.user.id;
  req.body.userId = userId;
  req.body.movieId = movieId;
  await userServices.removeFavorite(req,res);
})

app.get('/favorites/:id', userServices.verifyUser, async (req, res) => {
  const userId = req.user.id;
  const favorites = await userServices.getUserCatalog(userId);
  res.json(favorites);
})

app.get('/isFavorite', userServices.verifyUser, async (req, res) => {
  const userId = req.user.id;
  const { movieId } = req.query;

  try {
    const favorite = await userServices.isFavorite(userId, parseInt(movieId, 10));
    res.json({ isFavorite: favorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error checking favorite status' });
  }
});
// <---------------------- Filter  ------------------>
app.get('/search', async (req, res) => {
  const movie = req.query.q.toLowerCase()
  if (movie) {
    const response = await movieServices.getMoviesByFilter(movie)
    return res.json(response)
  }

  return res.status(400).json({ error: 'Invalid movie' });

})