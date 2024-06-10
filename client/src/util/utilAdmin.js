import * as axios from '../services/Axios';

export const clickMovies = async (setMovies,setShowList) => {

  try {
    const response = await axios.returnAllMovies();
    setMovies(response)
    setShowList('movies')
    console.log(response);
  } 
  catch (err) {
    console.log(err);
  }
};

export const clickUsers = async (setUsers,setShowList) => {
 
  try {
    const response = await axios.returnAllUsers();
    setUsers(response)
    setShowList('user')
    console.log(response);
  } 
  catch (err) {
    console.log(err);
  }
};

export const clickReviews = async (setReviews,setShowList) => {

  try {
    const response  = await axios.returnAllReviews();
    setShowList('review')
    setReviews(response)
  }
  catch (err){
    console.log(err);
  }
};

export const editMovie = async (movieId, movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector) => {
  
  try {
    await axios.editMovie(movieId, movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector)
  }
  catch (err){
    console.log(err);
  }
};

export const createMovie = async (movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector,movieAgeRating, movieTrailer) => {
  try {
    await axios.createMovieAdm(movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector,movieAgeRating, movieTrailer)
  }
  catch (err){
    console.log(err);
  }
};

export const deleteMovie = async (id) => {
  try {
    await axios.deleteMovieAdm(id)
  }
  catch (err){
    console.log(err);
  }
}

export const clickEdit =  async (setFlagText) => {
  setFlagText(true)
}

export const updateRating = async (setRating,newRating) => {
  setRating(newRating)
} 

export const updateReview = async (comments, rating, movie_id) => {

  try {
    await axios.updateReviewAdm(comments, rating, movie_id)
    alert('Review refresh !!!! ')
  }
  catch (err) {
    console.log(err);
  }

}


export const deleteUser = async (id_user) => {
  try {
    if (window.confirm(`Are you sure you want to delete this account ? This action cannot be undone.`)){
      await axios.deleteAdmAccount(id_user)
    }
  }
  catch (err){
    console.log(err);
  }
}

export const deleteReview = async (movie_id,user_id) => {

  try {
    if (window.confirm(`Are you sure you want to delete this review ? This action cannot be undone.`)){
      
      await axios.deleteAdmReview(movie_id,user_id)
    }
  }
  catch (err){
    console.log(err);
  }
}

export const makeAdmin = async (user_id ) => {
  try {
    const response = await axios.makeUserAdmin(user_id)
    if (response.status){
      alert(`User ${user_id} is Admin now !!!`)
    }else {
      alert(`the User ${user_id} is no longer an administrator!!!`)
    }
    
  }
  catch (err) {
    console.log(err);
  }
}

export const checkingAdmin = (email, emailAdm ) => {
  console.log(email,emailAdm);
  if (email === emailAdm){
    return true
  }
  return false
}

