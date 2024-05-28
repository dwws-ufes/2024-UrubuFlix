import prisma from "./prisma.js";
import bcrypt from "bcrypt";
import * as catalogServices from "./catalogServices.js";

export const createUser = async (data) => {
    const { username, email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
  
    try {
        const catalog = await catalogServices.createCatalog({ name: `${username}'s favorites`, genre: 'PLACEHOLDER' });
        
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
      throw new Error('User not created');
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