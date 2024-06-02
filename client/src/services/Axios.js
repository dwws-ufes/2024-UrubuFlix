import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://localhost:3002',
  withCredentials: true,
});

//================ Login =================== //
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//================ Register =================== //
export const register = async (username, email, password, confirmPassword,isAdmin) => {
  try {
    const response = await api.post('/register', { username, email, password, confirmPassword,isAdmin });
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//================ Forgot password =================== //
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgotPassword', { email });
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//================ reset Password =================== //
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post(`/resetPassword/${token}`, { password });
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//================ User  =================== //

// ====  verify user 
export const verifyUser = async () => {
  try {
    const response = await api.get('/verify');
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

// ==== logout
export const logout = async () => {
  try {
    const response = await api.get('/logout');
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

// ==== delete account
export const deleteAccount = async () => {
  try {
    const response = await api.delete('/delete');
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//================ Search   =================== //
export const searchMovie = async (movie) => {
  try {
    const response = await api.get(`/search?q=${movie}`)
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

export default api;
