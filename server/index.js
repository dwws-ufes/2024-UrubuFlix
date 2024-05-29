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

dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))

const PORT = process.env.PORT || 3002;

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
  }
  try{
    await genreENUM.initializeGenres();
    console.log('Genres initialized');
  }
  catch (error) {
    console.error('Error initializing genres:', error);
  }
});


//Register 
app.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    console.log('Por favor, preencha todos os campos');
    return res.json({ status: false, message: 'Empty campo' });
  }

  if (password !== confirmPassword) {
    console.log('As senhas não correspondem');
    return res.json({ status: false, message: 'As senhas não correspondem' });
  }
  
  try {
    
    const existingUser = await userServices.findUserByEmail(email);
    
    if (existingUser) {
      console.log('User already existed');
      return res.json({ status: false, message: 'User already existed' });
    }

    const user = await userServices.createUser({ username, email, password });
    return res.json(user);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

//Login 
app.post('/login', async (req, res) => {
  
  const { email, password} = req.body;
   
  const user = await prisma.user.findFirst({
    where: {
      email:email
    }
  });
  

  if (!user) {
    console.log('user is not registered');
    return res.json({status: false,message: 'user is not registered'})
  }

  if ( !email || !password) {
    console.log('Por favor, preencha todos os campos');
    return res.json({status: false,message: 'Empty campo'})
  }
  
  const validPassword = await bcrypt.compare(password,user.password)

  if (!validPassword){
    return res.json({message : "password is incorrect"})
  }

  const token = jwt.sign({username: user.username, email : user.email}, process.env.KEY, {expiresIn: '3h'})
  res.cookie('token', token, {httpOnly: true ,maxAge:3*60*60*1000}) //3h em milissegundos
  return res.json({status: true, message:"login successfully"})

});

//forgot password
app.post('/forgotPassword', async (req, res) => {
  const {email} = req.body

  try {
    const user = await prisma.user.findFirst({
      where: {
        email:email
      }
    });

    if (!user) {
      return res.json({message: "user not registered"})
    }

    const token = jwt.sign({id: user.id}, process.env.KEY, {expiresIn: '1h'})

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_NAME,
        pass: process.env.USER_PASSWORD
      }
    });

    var mailOptions = {
      from: process.env.USER_NAME,
      to: email,
      subject: 'Reset Password',
      text: `http://localhost:5173/resetPassword/${token}`
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.json({message: "error email not sent"})
      } else {
        return res.json({status: true, message: "email  sent"})
      }
    }); 
  }
  catch (err) {
    console.log(err);
  }

})

//reset password
app.post('/resetPassword/:token', async (req,res) => {
  const {token} = req.params;
  const {password} = req.body;

  try {
    const decoded =  jwt.verify(token,process.env.KEY)
    const userId = decoded.id
    const hashPassword = await bcrypt.hash(password,10)

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        password: hashPassword 
      }
    });

    res.json({status: true, message: "ok"})

  }catch (err) {
    console.log(err);
    return res.json("invalid token")
  }
})

//verifica se usuario está logado
const verifyUser = async (req, res, next) => {
  
  try {
    
    const token = req.cookies.token;
    
    if (!token){
      return res.json({status: false, message : "no token"})
    }

    const decoded = jwt.verify(token, process.env.KEY)
    req.user = decoded
    next()

  }
  catch (err) {
    console.error("Error verifying token:", err);
    return res.json({status: false, message: "UNAUTHORIZED !!!!!"})
  }
}

app.get("/verify", verifyUser, (req,res) => {
  return res.json({status: true, message: "authorized", user: req.user})
})

app.get('/logout', (req,res) => {
  res.clearCookie('token')
  return res.json({status : true})
})

app.delete('/delete', async (req, res) => {
  const token = req.cookies.token;
  const decoded =  jwt.verify(token,process.env.KEY)
  
  try {
    
    const user = await prisma.user.findFirst({
      where: {
        email:decoded.email
      }
    });

    if (!user) {
      return res.json({status: false, message: "user not exist"})
    }

    await prisma.user.delete({
      where: {
        id:user.id,
      },
    });

    res.clearCookie('token')
    return res.json({status : true, message: 'delete sucess !!!'})
  }
  catch (err){
    console.log(err);
    return res.json({status : false, message: 'error delete user'})
  }
  
})

//===================// read file movies //===================//
const filePath = './script_movies/movies.json'

app.get('/films', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData); 
    } catch (err) {
      console.error('Erro ao analisar JSON:', err);
      res.status(500).send('Erro ao analisar JSON');
    }
  });
});
