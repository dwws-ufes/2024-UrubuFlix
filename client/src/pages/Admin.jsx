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
      <div className='header'>
      <h1>Admin</h1>
      </div>
      <div className='buttons'>
        <button className='btn' onClick={() => until.clickMovies(setMovies,setShowList)}>Movies</button>
        <button className='btn' onClick={() => until.clickUsers(setUsers,setShowList)}>Users</button>
        <button className='btn' onClick={() => until.clickReviews(setReviews,setShowList)}>Reviews</button>
      </div>

        {
          showList === 'movies' && (
            <div className='movies'>
              <h2>Movies</h2>
              <ul>
              <h3>ID&nbsp;&nbsp;: Name</h3>
                {movies.map(movie => (
                    <li key={movie.id}>
                      {movie.id} : {movie.name}
                    </li>
                ))}
              </ul>
            </div>
          )
        }

        {
          showList === 'user' && (
            <div className='users'> 
              <h2>Users</h2>
                <ul>
                <h3>ID&nbsp;&nbsp;: Name</h3>
                  {users.map(user => (
                      <li key={user.id}>
                        {user.id} and {user.username} <button onClick={() => until.deleteUser(user.id)}>X</button>
                      </li>
                  ))}
                </ul>
            </div>
          )
        }

        {
          showList === 'review' && (
            <div className='review'> 
              <h2>Review</h2>
                <ul>
                <h3>Movie ID&nbsp;&nbsp;: Comment - User ID</h3>
                  {reviews.map(review => (
                      <li key={review.movie_id}>
                        {review.movie_id} : {review.comment} - {review.user_id} <button onClick={() => until.deleteReview(review.movie_id,review.user_id)}>X</button>
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