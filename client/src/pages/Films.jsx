import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom';
import '../style/Films.css'

function Films() {
  const [film, setFilms] = useState([])

  
  useEffect(() => {
    Axios.get('http://localhost:3002/films')
    .then((res) => {
      if (res.data) {
        setFilms(res.data)
      }else {
        console.log(error);
      }
    })
  },[])

  return (
    <div className="film-grid">
      {film.map(film => (
          <div className="film-card" key={film.id}>
            <Link to={`/film/${film.id}`} key={film.id}>
            <img src={film.poster} alt={film.name} />
            <h2>{film.name}</h2>
            </Link>
          </div>
      ))}
    </div>
  )
}

export default Films