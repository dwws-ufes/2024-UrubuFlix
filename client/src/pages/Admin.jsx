import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { verifyUser} from '../services/Axios';
import * as until from '../util/utilAdmin'
import ReactStars from 'react-stars';
import NavBar from './NavBar';
import Modal from '../util/modal';
import '../style/Admin.css'
import { setAgeRating } from '../../../server/services/movieServices';

function Admin() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [showList, setShowList] = useState('')
  const [admin, setAdmin] = useState([])
  const [flagtext, setFlagText] = useState(false)
  const [comments,setComments] = useState('');
  const [rating, setRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [movieId, setMovieId] = useState('');
  const [movie, setMovie] = useState(null);
  const [movieName, setMovieName] = useState('');
  const [movieImage, setMovieImage] = useState('');
  const [movieDescription, setMovieDescription] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [movieYear, setMovieYear] = useState('');
  const [movieDuration, setMovieDuration] = useState('');
  const [movieDirector, setMovieDirector] = useState('');
  const [movieAgeRating, setMovieAgeRating] = useState('');
  const [movieTrailer, setMovieTrailer] = useState('');

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

  useEffect(() => {
    setMovie(movies.find(m => m.id === movieId));
  }, [movieId]);

  const editMovie = async () => {
    try {
      await until.editMovie(movieId, movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector)
      alert('Movie edited successfully!')
      setShowModal(false)
    }
    catch (error) {
      alert('Error editing movie!')
      console.log(error);
    }
  }

  const createMovie = async () => {
    try {
      await until.createMovie(movieName, movieImage, movieDescription, movieGenre, movieYear, movieDuration, movieDirector, movieAgeRating, movieTrailer)
      alert('Movie created successfully!')
      setShowModalAdd(false)
    }
    catch (error) {
      alert('Error creating movie!')
      console.log(error);
    }
  }


  const cleanStateMovie = () => {
    setMovieName('');
    setMovieImage('');
    setMovieDescription('');
    setMovieGenre('');
    setMovieYear('');
    setMovieDuration('');
    setMovieDirector('');
    setMovieId('');
    setAgeRating('');
    setMovieTrailer('');
    setMovie(null);
  }
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
                <h3>
                  MovieId : MovieName
                  <button className='add' onClick={() =>{setShowModalAdd(true);}}></button>
                </h3>
                <Modal isOpen={showModalAdd} setModalOpen={() => {setShowModalAdd(!showModalAdd);cleanStateMovie();}}>
                  <div className='modal'>
                    <h2>Create a new movie!</h2>
                    <form onSubmit={(e) => { e.preventDefault(); createMovie(); }}>
                    <input type='text' placeholder='Enter new movie name' value={movieName} onChange={e => setMovieName(e.target.value)} />
                    <input type='text' placeholder='Enter new movie image' value={movieImage} onChange={e => setMovieImage(e.target.value)} />
                    <input type='text' placeholder='Enter new movie description' value={movieDescription} onChange={e => setMovieDescription(e.target.value)} />
                    <input type='text' placeholder='Enter new movie genre' value={movieGenre} onChange={e => setMovieGenre(e.target.value)} />
                    <input type='text' placeholder='Enter new movie year' value={movieYear} onChange={e => setMovieYear(e.target.value)} />
                    <input type='text' placeholder='Enter new movie duration' value={movieDuration} onChange={e => setMovieDuration(e.target.value)} />
                    <input type='text' placeholder='Enter new movie director' value={movieDirector} onChange={e => setMovieDirector(e.target.value)} />
                    <input type='text' placeholder='Enter new movie age_rating' value={movieDirector} onChange={e => setMovieAgeRating(e.target.value)} />
                    <input type='text' placeholder='Enter new movie trailer' value={movieDirector} onChange={e => setMovieTrailer(e.target.value)} />
                    <button type='submit'>Edit</button>
                    </form>
                  </div>
                </Modal>
                {movies.map(movie => (
                  <li key={movie.id}>
                    <div className='film'>
                      {movie.id} : {movie.name} 
                      <div className='botoes'>
                        <button className='edit' onClick={() => {setShowModal(true); setMovieId(movie.id);}}>
                          <FontAwesomeIcon icon={faPencilAlt} />
                        </button>
                        <button className='delete' onClick={() => until.deleteMovie(movie.id)}>
                          <FontAwesomeIcon icon={faTrash} /> 
                        </button>
                      </div>
                    </div>
                  </li>
                ))}

                <Modal isOpen={showModal} setModalOpen={() => {setShowModal(!showModal); cleanStateMovie();}}>
                  <div className='modal'>
                    <h2>Edit Movie: {movie?.name}</h2>
                    <form onSubmit={(e) => { e.preventDefault(); editMovie(); }}>
                    <input type='text' placeholder='Enter new movie name' value={movieName} onChange={e => setMovieName(e.target.value)} />
                    <input type='text' placeholder='Enter new movie image' value={movieImage} onChange={e => setMovieImage(e.target.value)} />
                    <input type='text' placeholder='Enter new movie description' value={movieDescription} onChange={e => setMovieDescription(e.target.value)} />
                    <input type='text' placeholder='Enter new movie genre' value={movieGenre} onChange={e => setMovieGenre(e.target.value)} />
                    <input type='text' placeholder='Enter new movie year' value={movieYear} onChange={e => setMovieYear(e.target.value)} />
                    <input type='text' placeholder='Enter new movie duration' value={movieDuration} onChange={e => setMovieDuration(e.target.value)} />
                    <input type='text' placeholder='Enter new movie director' value={movieDirector} onChange={e => setMovieDirector(e.target.value)} />
                    <button type='submit'>Edit</button>
                    </form>
                  </div>
                </Modal>
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