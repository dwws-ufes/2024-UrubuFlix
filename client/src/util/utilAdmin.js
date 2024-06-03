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

export const deleteUser = async (id_user) => {
  try {
    if (window.confirm(`Tem certeza de que deseja excluir sua conta ${id_user}? Esta ação não pode ser desfeita.`)){
      await axios.deleteAdmAccount(id_user)
    }
  }
  catch (err){
    console.log(err);
  }
}


