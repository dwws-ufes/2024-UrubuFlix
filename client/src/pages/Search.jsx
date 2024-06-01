import React from 'react'
import {Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/Films.css'

function Search() {
  const location = useLocation();
  const { movies } = location.state || { movies: [] }; 

  
  return (
    <div className="film-grid">
      {movies.map(film => (
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

export default Search