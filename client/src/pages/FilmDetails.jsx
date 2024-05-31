import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState({})

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

  function extractVideoId(url) {
    let videoId = url.split('v=')[1];
    let ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
    return videoId;
  }


  return (
    <div className='movie-info'>
      <div className='movie-poster'>
        <div className='poster'>
          <img src={film.poster} alt={film.name} />
        </div>
      </div>

      <div className='movie-info'>
        <h2>{film.name}</h2>
        <p>Release Date: {film.release_date}</p>
        <p>Duration: {film.duration} min</p>
        <p>Director: {film.director}</p>
        {/* <p>Genre: {film.move}</p> */}
        <p>Age rating: {film.age_rating}</p>
        <p>Synopsis: {film.synopsis}</p>
        {/* <p>Rotten Tomatoes Score: {film.total_rating}</p> */}
      </div>

      <ReactPlayer
        url={film.trailer}
        controls={true}
        width="640px"
        height="360px"
      />
  
    </div>
    
  );
}

export default FilmDetails;