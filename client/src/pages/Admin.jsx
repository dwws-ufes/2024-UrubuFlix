import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { verifyUser} from '../services/Axios';
import * as until from '../util/utilAdmin'
import ReactStars from 'react-stars';
import NavBar from './NavBar';
import '../style/Admin.css'

function Admin() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [showList, setShowList] = useState('')
  const [admin, setAdmin] = useState([])
  const [flagtext, setFlagText] = useState(false)
  const [comments,setComments] = useState('');
  const [rating, setRating] = useState(0)


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        setAdmin(response.user)
        
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
                      {movie.id} : {movie.name} {movie.reviews}
                      <button className='delete' onClick={() => until.deleteMovie(movie.id, movie.reviews)}>
                        <FontAwesomeIcon icon={faTrash} /> 
                      </button>
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
                      {until.checkingAdmin(user.email, admin.email) ? 
                       <><span>{user.id}</span>&nbsp;:&nbsp;<span>{user.username }</span></>: 
                        <>
                          <span>{user.id}</span>&nbsp;:&nbsp;<span>{user.username }</span>
                          <button className='edit' onClick={() => until.makeAdmin(user.id)}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                          </button>
                          <button className='delete' onClick={() => until.deleteUser(user.id)}>
                              <FontAwesomeIcon icon={faTrash} /> 
                          </button>
                        </>
                      }
                      
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
              <h3>Movie ID: Comment: User ID: Rating:</h3>
              <ul>
                {reviews.map(review => (
                  <li key={review.movie_id}>
                    <div className='review-data'>
                      <span>{review.movie_id}</span>&nbsp;:&nbsp;<span>{review.comment}</span>&nbsp;:&nbsp;<span>{review.user_id}</span>&nbsp;:&nbsp;<span>{review.rating}</span>
                      <button className='edit' onClick={() => until.clickEdit(setFlagText)}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button className='delete' onClick={() => until.deleteReview(review.movie_id,review.user_id)}>
                        <FontAwesomeIcon icon={faTrash}/>
                      </button>
                      {
                        flagtext && (
                              <div>
                                <p>Refresh review:</p><br />
                                <ReactStars count={5} onChange={(newRating) => until.updateRating(setRating,newRating)} size={20} activeColor="#ffd700" />
                                <form onSubmit={() => until.updateReview(comments, rating,review.movie_id)}>
                                  <textarea className='text'
                                    value={comments}
                                    onChange={(event) => setComments(event.target.value)}
                                    placeholder="Enter your comment here"
                                  />
                                  <button type="submit" onClick={() => until.clickEdit(setFlagText)}>Send</button>
                                </form>
                                <br/>
                              </div>
                            )
                      }

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