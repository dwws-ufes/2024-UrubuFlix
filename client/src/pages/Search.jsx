import React from 'react'
import {Link, useNavigate, useLocation } from 'react-router-dom';
import '../style/Films.css'
import NavBar from './NavBar';
import Footer from './Footer';

function Search() {
  const location = useLocation();
  const { movies } = location.state || { movies: [] }; 

  return (
    <div>
      <NavBar/>
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
      <Footer/>
    </div>
   
  )
}

export default Search