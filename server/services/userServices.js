import prisma from "./prisma.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import * as catalogServices from "./catalogServices.js";
import * as moviesServices from "./movieServices.js";

export const createUser = async (data) => {
    const { username, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const catalog = await catalogServices.createCatalog({ name: `${username}'s favorites`, genres : ['PLACEHOLDER'] });

        const user = await prisma.user.create({
        data: {
          email: email,
          username: username,
          password: hashPassword,
          catalog: { connect: { id: catalog.id } }
        },
      });
      
      return { status: true, message: 'User created successfully', user };
    }
    catch (err) {
      console.error('User not created', err);
      const catalog = await catalogServices.findCatalogName(`${username}'s favorites`)
      await catalogServices.deleteCatalog(catalog.id);
      throw new Error('User not created');
    }
};

export const createAdmin = async (data) => {
  const { username, email, password } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
      const catalog = await catalogServices.createCatalog({ name: `${username}'s favorites`, genres : ['PLACEHOLDER'] });

      const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashPassword,
        is_admin: true,
        catalog: { connect: { id: catalog.id } }
      },
    });
    
    return { status: true, message: 'User created successfully', user };
  }
  catch (err) {
    console.error('User not created', err);
    const catalog = await catalogServices.findCatalogName(`${username}'s favorites`)
    await catalogServices.deleteCatalog(catalog.id);
    throw new Error('User not created');
  }
};

export const findUserById = async (id) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: id },
      });
      return user;
    } catch (err) {
      console.error('Error finding user by id', err);
      throw new Error('Error finding user');
    }
};

export const findUserByEmail = async (email) => {
    try {
      const user = await prisma.user.findFirst({
        where: { email: email },
      });
      return user;
    } catch (err) {
      console.error('Error finding user by email', err);
      throw new Error('Error finding user');
    }
  };

export const getAllUsers = async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (err) {
      console.error('Error finding all users', err);
      throw new Error('Error finding all users');
    }
};
export const getUserCatalog = async (userId) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId },
        include: {
          catalog:{
            include: {
              catalog_has_movie: {
                include: {
                  movie: true
                }
              }
            }
          }
        },
      });
      return user.catalog;
    } catch (err) {
      console.error('Error finding user catalog', err);
      throw new Error('Error finding user catalog');
    }
};
export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    console.log('Please fill in all fields');
    return res.json({ status: false, message: 'Empty field' });
  }

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.json({ status: false, message: 'Passwords do not match' });
  }
  
  try {
    
    const existingUser = await findUserByEmail(email);
    
    if (existingUser) {
      console.log('User already existed');
      return res.json({ status: false, message: 'User already existed' });
    }

    const user = await createUser({ username, email, password });
    return res.json(user);
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password} = req.body;
   
  const user = await prisma.user.findUnique({
    where: {
      email:email
    }
  });


  if ( !email || !password) {
    console.log('Please fill in all fields');
    return res.json({status: false,message: 'Empty field'})
  }

  if (!user) {
    console.log('user is not registered');
    return res.json({status: false,message: 'User is not registered'})
  }

  const validPassword = await bcrypt.compare(password,user.password)

  if (!validPassword){
    return res.json({status: false, message: "Incorrect password"})
  }

  const token = jwt.sign({username: user.username, email : user.email}, process.env.KEY, {expiresIn: '3h'})
  res.cookie('token', token, {httpOnly: true ,maxAge:3*60*60*1000}) //3h em milissegundos
  return res.json({status: true, message:"login successfully", admin : user.is_admin})

};


export const verifyUser = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      
      if (!token){
        return res.json({status: false, message : "no token"})
      }
      
      const decoded = jwt.verify(token, process.env.KEY)
      req.user = decoded
      //verify admin
      const {is_admin} = await findUserByEmail(req.user.email)
      req.user.admin = is_admin
      next()
  
    }
    catch (err) {
      console.error("Error verifying token:", err);
      return res.json({status: false, message: "UNAUTHORIZED !!!!!"})
    }
};

export const deleteUser = async (req,res) => {
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
      const idCatalog = user.catalog_id;
      

      await prisma.user.delete({
        where: {
          id:user.id,
        },
      });
      await catalogServices.deleteCatalog(idCatalog);
      
      res.clearCookie('token')
      return res.json({status : true, message: 'delete sucess !!!'})
    }
    catch (err){
      console.log(err);
      return res.json({status : false, message: 'error delete user'})
    }
};

export const forgotPassword = async (req, res) => { 
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
};

export const resetPassword = async (req, res) => {
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
};

export const makeAdmin = async (req, res) => {
  console.log(req);
  try {
    const user = await prisma.user.findFirst({
      where: {
        id:req
      }
    });

    if (!user) {
      return {message: "user not registered"}
    }

    if (user.is_admin == true) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          is_admin: false
        }
      });

      return {status: false, message: "the account is already admin"}
    }

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        is_admin: true
      }
    });

    return {status: true, message: "ok"}

  }catch (err) {
    console.log(err);
    return res.json("error")
  }
};

export const removeAdmin = async (req, res) => {
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

    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        is_admin: false
      }
    });

    return res.json({status: true, message: "ok"})

  }catch (err) {
    console.log(err);
    return res.json("error")
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.body.userId;
  const catalog = await getUserCatalog(userId);
  const movies = await catalogServices.getMovies(catalog.id);

  return res.json(movies);
}


export const addFavorite = async (req,res) => {
  const { userId, movieId } = req.body;
  const catalog = await getUserCatalog(userId);
  try{
    await catalogServices.addMovie(catalog.id, movieId);
    return res.json({status: true, message: 'Movie added to favorites'});
  }
  catch (err) {
    console.error(err);
    return res.json({status: false, message: 'Error adding movie to favorites'});
  }
  
};

export const removeFavorite = async (req, res) => {
  const { userId, movieId } = req.body;
  const catalog = await getUserCatalog(userId);
  try{
    await catalogServices.removeMovie(catalog.id, movieId);
    return res.json({status: true, message: 'Movie removed from favorites'});
  }
  catch (err) {
    console.error(err);
    return res.json({status: false, message: 'Error removing movie from favorites'});
  }
}

export const isFavorite = async (userId, movieId) => {
  const catalog = await getUserCatalog(userId);
  const favorite = await prisma.catalog_has_movie.findFirst({
    where: {
      catalog_id: catalog.id,
      movie_id: movieId
    }
  });
  return favorite !== null;
};

//------------- ADMIN -----------------------//

export const removeUserById = async (id_user) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: id_user },
    });

    if (!user) {
      return {status: false, message: "user not exist"}
    }
    const idCatalog = user.catalog_id;
    

    await prisma.user.delete({
      where: {
        id:user.id,
      },
    });
    await catalogServices.deleteCatalog(idCatalog);
    
    return {status : true, message: 'delete sucess !!!'}

  } catch (err) {
    console.error('Error finding user by id', err);
    throw new Error('Error finding user');
  }
}