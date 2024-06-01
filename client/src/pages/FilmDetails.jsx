import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import ReactStars from "react-rating-stars-component";
import NavBar from './NavBar';
import '../style/FilmDetails.css'
import Footer from './Footer';

const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState({});
  const [comments, setComments] = useState(''); // Alterado para string vazia
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);

  Axios.defaults.withCredentials = true;

  //pega as informações do filme
  useEffect(() => {
    Axios.get(`http://localhost:3002/films/${id}`)
      .then((res) => {
        if (res.data) {
          setFilm(res.data);
        } else {
          console.log('Error:', res.error);
        }
      })
      .catch(error => console.log('Error:', error));
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
            <img src={film.poster} alt={film.name} />
          </div>
          <div className='info-movie'>
            <h2>{film.name}</h2>
            <p>Release Date: {film.release_date}</p>
            <p>Duration: {film.duration} min</p>
            <p>Director: {film.director}</p>
            <p>Age rating: {film.age_rating}</p>
            <p>Genres: {film.genres && film.genres.map((genre, index) =>
              genre.genre ?
                (index === 0 ? capitalizeFirstLetter(genre.genre.name) :
                  genre.genre.name.toLowerCase()) : ''
            ).join(', ')
            }</p>
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
            <button type="submit">Enviar</button>
          </form>
          <div className='reviews'>
            <h3>Reviews</h3>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className='review'>
                  <p><strong>{review.user.username}</strong>: {review.comment} Rating: {review.rating} Review at: {review.date}</p>
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
