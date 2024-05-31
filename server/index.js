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



app.get('/films', async (req, res) => {
  const movies = await movieServices.getAllMovies();
  res.json(movies);

});

app.get('/films/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const movie = await movieServices.getMovieById(id);
  res.json(movie);
});

app.get('/catalogs', async (req, res) => {
  const catalogs = await catalogServices.getAllCatalogs();
  res.json(catalogs);
});