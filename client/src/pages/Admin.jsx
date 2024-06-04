import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { verifyUser, logout, deleteAccount } from '../services/Axios';
import * as until from '../util/utilAdmin'
import urubuUser from '../assets/urubu.png'; 
import NavBar from './NavBar';
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
  <div className='container'>
    <NavBar />
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
              <h3>MovieId : MoveName</h3>
              {movies.map(movie => (
                <li key={movie.id}>
                  <div className='film'>
                    {movie.id} : {movie.name}
                  </div>
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
            <h3>UserId&nbsp;&nbsp;: UserName</h3>
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <div className='user-data'>
                    <span>{user.id}</span>&nbsp;:&nbsp;<span>{user.username}</span>
                    <button className='edit'>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className='delete'
                      onClick={() => until.deleteUser(user.id)}><FontAwesomeIcon icon={faTrash} /> 
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      }

      {
        showList === 'review' && (
          <div className='review'> 
            <h2>Reviews</h2>
            <h3>Movie ID&nbsp;&nbsp;: Comment : User ID</h3>
            <ul>
              {reviews.map(review => (
                <li key={review.movie_id}>
                  <div className='review-data'>
                    <span>{review.movie_id}</span>&nbsp;:&nbsp;<span>{review.comment}</span>&nbsp;:&nbsp;<span>{review.user_id}</span>
                    <button className='edit'>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className='delete'
                      onClick={() => until.deleteReview(review.movie_id,review.user_id)}>
                      <FontAwesomeIcon icon={faTrash} onClick={() => until.deleteUser(user.id)} />
                    </button>

                  </div>
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