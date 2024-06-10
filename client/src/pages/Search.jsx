import React from 'react'
import {Link, useLocation } from 'react-router-dom';
import '../style/Films.css'
import NavBar from './NavBar';
import Footer from './Footer';

function Search() {
  const location = useLocation();
  const { movies } = location.state || { movies: [] }; 

  return (
    <><div className='app-container' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <div className='navbar'>
        <NavBar />
      </div>

      <div className="film-grid container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: '20px',
        }}>
        {movies.length > 0 ? (
          movies.map(film => (
            <div className="film-card" key={film.id} style={{ margin: '10px' }}>
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

    </div><Footer></Footer></>
   
  )
}

export default Search