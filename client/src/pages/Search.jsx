import React from 'react'
import {Link, useLocation } from 'react-router-dom';
import '../style/Films.css'
import NavBar from './NavBar';
import Footer from './Footer';

function Search() {
  const location = useLocation();
  const { movies } = location.state || { movies: [] }; 

  return (
    <div className='app-container'>
      
      <div className='navbar'>
        <NavBar/>
      </div>
      

       <div className="film-grid container">
       {movies.length > 0 ? (
            movies.map(film => (
              <div className="film-card" key={film.id}>
                <Link to={`/film/${film.id}`} key={film.id}>
                  <img src={film.poster} alt={film.name} />
                  <h2>{film.name}</h2>
                </Link>
              </div>
            ))
          ) : (
            <div className="not-found">
              <h2>movie not found</h2>
            </div>
          )}
      </div>
      
      <div className='footer'>
        <Footer/>
      </div>
      
    </div>
   
  )
}

export default Search