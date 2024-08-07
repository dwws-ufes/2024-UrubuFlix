import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ReactStars from "react-rating-stars-component";
import NavBar from './NavBar';
import '../style/FilmDetails.css'
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import poster from '../assets/posterplaceholder.jpeg'

const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState({});
  const [comments, setComments] = useState(''); // Alterado para string vazia
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);
  const [total_rating, setTotal_rating] = useState(0);

  Axios.defaults.withCredentials = true;

  //pega as informações do filme
  useEffect(() => {
    fetchMovie();
  }, [id]);

  //verifica se o usuário está logado e pega as informações do usuário
  useEffect(() => {
    Axios.get('http://localhost:3002/verify', {
      withCredentials: true
    }
    ) 
    .then((res) => {
      if (res.data) {
        setUser(res.data);
        checkIfFavorite(res.data.id);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchMovie = async () => {
    try{
      Axios.get(`http://localhost:3002/films/${id}`)
      .then((res) => {
        if (res.data) {
          setFilm(res.data);
          setTotal_rating(res.data.total_rating);
        } else {
          console.log('Error:', res.error);
        }
      })
      .catch(error => console.log('Error:', error));
    }
    catch (error) {
      console.log('Error:', error);
    }
    
  };

  const fetchReviews = async () => {
    try {
      const response = await Axios.get(`http://localhost:3002/reviewMovie/${id}`,{
        withCredentials: true
      });
      if (response.data) {
        setReviews(response.data);
      } else {
        console.log('Error fetching reviews:', response.error);
      }
    } catch (error) {
      console.log('Error fetching reviews:', error);
    }
  };


  const handleAddReview = async () => {
  try {
    const review = { rating, comments, filmId: id };
    await Axios.post('http://localhost:3002/review', review, {
      withCredentials: true
    })
    .then((res) => {
      if (res.data) {
        setComments(''); // Atualiza o estado dos comentários
        fetchReviews();
        fetchMovie();
        alert('Review added successfully');
      } else {
        console.log('Error:', res.error);
      }
    })
  } catch (error) {
    console.log('Error:', error);
  }
};

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddReview();
  };

  const handleAddFavorites = async (event) => {
    event.preventDefault();
    try {
      await Axios.post('http://localhost:3002/addFavorite', { filmId: id }, {
        withCredentials: true
      })
        .then((res) => {
          if (res.data) {
            alert('Movie added to favorites');
            setIsFavorite(true);
          } else {
            console.log('Error:', res.error);
          }
        })
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleRemoveFavorites = async (event) => {
    event.preventDefault();
    try {
      await Axios.delete('http://localhost:3002/removeFavorite', { 
        data: { filmId: id },
        withCredentials: true
      })
        .then((res) => {
          if (res.data) {
            alert('Movie removed from favorites');
            setIsFavorite(false);
          } else {
            console.log('Error:', res.error);
          }
        })
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleRemoveReview = async (event) => {
    event.preventDefault();
    try {
      await Axios.delete(`http://localhost:3002/review`,
        {
          data: {movieid: id},
          withCredentials: true
        });
      fetchReviews();
      fetchMovie();
      alert('Review removed successfully');
    } catch (error) {
      console.log('Error removing review:', error);
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const checkIfFavorite = async (userId) => {
    try {
      const response = await Axios.get(`http://localhost:3002/isFavorite?movieId=${id}`, {
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };
  
  return (
    <div className='app'>
      <NavBar />
      <div className='movie-info'>
        <div className='movie-poster'>
          <div className='poster'>
            <img 
              src={film.poster} 
              alt={film.name} 
              onError={(e) => { e.target.onerror = null; e.target.src = poster; }} 
              style={{ 
                width: '200px', 
                height: '300px', 
                objectFit: 'cover' 
              }}
            />
          </div>
          <div className='rdflink' style={{flexDirection: 'row-reverse'}}>
          <li><Link to={`/Rdfs/${film.id}`}>RDFS</Link></li>
          </div>

          <div className='info-movie'>
            <h2>{film.name}</h2>
            <p>Release Date: {film.release_date ? new Date(film.release_date).toISOString().split('T')[0] : 'N/A'}</p>
            <p>Duration: {film.duration} min</p>
            <p>Director: {film.director}</p>
            <p>Age rating: {film.age_rating}</p>
            <p>Genres: {film.genres && film.genres.map((genre, index) =>
              genre.genre ?
                (index === 0 ? capitalizeFirstLetter(genre.genre.name) :
                  genre.genre.name.toLowerCase()) : ''
            ).join(', ')
            }</p>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft:10 }}>
              <ReactStars count={1} value={1} size={20} activeColor="#ffd700" edit={false} />
              <p>: {total_rating}</p>
            </div>
            <p>Synopsis: {film.synopsis}</p>
            {isFavorite ? (
              <button className='favorite' onClick={handleRemoveFavorites}>Remove from Favorites</button>
            ) : (
              <button className='favorite' onClick={handleAddFavorites}>Add to Favorites</button>
            )}
          </div>
        </div>
        <hr />
        <div className='player'>
          {film.trailer ?
            <ReactPlayer
              url={film.trailer}
              controls={true}
              width="400px"
              height="360px"
            />
            : <p>Error trailer</p>}
        </div>
        <hr />
        <div className='comments'>
          <h2>POPULAR REVIEWS</h2>
          <h3>Make your review of the film</h3>
          <div className='stars'>
            <p>Your rating for the film:</p>
            <ReactStars count={5} onChange={setRating} size={20} activeColor="#ffd700" />
          </div>
          <form onSubmit={handleSubmit}>
            <textarea className='text'
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Enter your comment here"
            />
            <button type="submit">Send</button>
          </form>
          <div className='reviews'>
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className='review-data' 
                  style={{ 
                    border: '1px solid #000', 
                    padding: '10px', 
                    margin: '10px 0', 
                    backgroundColor: '#282828' 
                  }}>

                  <div className='review-content'>
                    <p><strong>{review.user.username}</strong>: {review.comment}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span>Rating: </span>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={24}
                        activeColor="#ffd700"
                        isHalf={true}
                        edit={false}
                      />
                    </div>
                  </div>
                  {user && review.userId === user.id && (
                    <><button className='edit' style={{ marginLeft: 'auto' }} >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className='remove' onClick={handleRemoveReview}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button></>
                  )}
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FilmDetails;