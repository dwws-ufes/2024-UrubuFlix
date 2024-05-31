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
  const [film, setFilm] = useState({})
  const [comments, setComments] = useState([]); 
  const [rating, setRating] = useState(0);

  useEffect(() => {
    Axios.get(`http://localhost:3002/films/${id}`)
    .then((res) => {
      if (res.data) {
        setFilm(res.data)
      }else {
        console.log(error);
      }
    })
  },[])

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setComments('');
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <div className='app'>
      <NavBar/>
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
            </div>  
          </div>
      
      <hr/>
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

      <hr/>

      <div className='comments'>
        <h2>POPULAR REVIEWS</h2>
        <h3>Make your review of the film</h3>
        <div className='stars'>
          <p>Your rating for the film:</p>
          <ReactStars count={5} onChange={setRating} size={20} activeColor="#ffd700"/>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea className='text'
            onChange={(event) => setComments(event.target.value)}
            placeholder="Enter your comment here"
          />
          <button type="submit">Enviar</button>
        </form>
      </div>

      </div>
      <Footer/>

    </div>
  );
}

export default FilmDetails;