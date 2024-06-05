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

//================ Admin ================== //
//-- retrun all Movies
export const returnAllMovies = async () => {
  try {
    const response = await api.get('/films');
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

//-- return all users
export const returnAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

//--  return all reviwes
export const returnAllReviews = async () => {
  try {
    const response = await api.get('/reviews');
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

//--- delete movie 
export const deleteMovieAdm = async (id, reviews) => {
  try {
    const response = await api.delete('/admin/deleteAdmin', {data : {id,reviews}});
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
}

// --- delete account
export const deleteAdmAccount = async (id_user) => {
  try {
    const response = await api.delete('/admin/delete',{data: {id_user}});
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

//--- delete review 
export const deleteAdmReview = async (movie_id,user_id) => {
  try {
    const response = await api.delete('/admin/deleteReview',{data: {movie_id, user_id}});
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};


//--- refresh review
export const refreshAdmReview = async (movie_id,user_id) => {
  try {
    const response = await api.upadte('/admin/refreshReview',{data: {movie_id, user_id}});
    return response.data;
  } 
  catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateReviewAdm = async (comments, rating, movie_id) => {
  try {
    const review = { rating, comments, filmId: movie_id };
    const response = await api.post('/review',review, { withCredentials: true})
  }
  catch (err){
    console.log(err);
    throw err;
  }
}

//-- user now admin
export const makeUserAdmin = async (user_id) => {
  try {
    const response =  await api.put('/admin/updateAdmin', {data : {user_id}})
    return response.data
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

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
