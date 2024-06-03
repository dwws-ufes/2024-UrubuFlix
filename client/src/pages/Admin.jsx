import React, { useEffect, useState } from 'react';
import urubuUser from '../assets/urubu.png'; 
import { useNavigate } from 'react-router-dom';
import { verifyUser, logout, deleteAccount } from '../services/Axios';
import * as until from '../util/utilAdmin'
import '../style/Admin.css'


function Admin() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [showList, setShowList] = useState('')


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        
        if (response.status && response.user.admin == true) {
          navigate('/admin')         
        } 
        else {
          navigate('/');
        }
      } 
      catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);


  return (
    <div>
    <h1>Admin</h1>
        <button onClick={() => until.clickMovies(setMovies,setShowList)}>Movies</button>
        <button onClick={() => until.clickUsers(setUsers,setShowList)}>Users</button>
        <button onClick={() => until.clickReviews(setReviews,setShowList)}>Reviews</button>

        {
          showList === 'movies' && (
            <div>
              <h2>Movies</h2>
              <ul>
                {movies.map(movie => (
                    <li key={movie.id}>
                      {movie.id} and {movie.name}
                    </li>
                ))}
              </ul>
            </div>
          )
        }

        {
          showList === 'user' && (
            <div> 
              <h2>Users</h2>
                <ul>
                  {users.map(user => (
                      <li key={user.id}>
                        {user.id} and {user.username} <button onClick={() => until.deleteUser(user.id)}>X {user.id}</button>
                      </li>
                  ))}
                </ul>
            </div>
          )
        }

        {
          showList === 'review' && (
            <div> 
              <h2>Review</h2>
                <ul>
                  {reviews.map(review => (
                      <li key={review.user_id}>
                        {review.user_id} and {review.comment} <button onClick={() => until.deleteReview(review.user_id)}>X </button>
                      </li>
                  ))}
                </ul>
            </div>
          )
        }     
    </div>
  )
}

export default Admin