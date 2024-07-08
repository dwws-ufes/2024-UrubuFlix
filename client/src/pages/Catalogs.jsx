import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';
import poster from '../assets/posterplaceholder.jpeg'


function Category() {
  const [catalogs, setCatalogs] = useState([]);

  useEffect(() => {
    Axios.get('http://localhost:3002/catalogs')
    .then((res) => {
      if (res.data) {
        setCatalogs(res.data)
      }else {
        console.log(error);
      }
    })
  },[])

  return (
    <div className='catalog-grid'>
      {catalogs.map(catalog => (
        <div className='films' key={catalog.id}>
          {catalog.catalog_has_movie.length > 0 && <h2>{catalog.name}</h2>}
          <div className='film-grid'>
            {catalog.catalog_has_movie.map(movieObj => (
              <div className='film-card' key={movieObj.movie.id}>
                <Link to={`/film/${movieObj.movie.id}`} key={movieObj.movie.id}>
                <img 
                  src={movieObj.movie.poster} 
                  alt={movieObj.movie.name} 
                  onError={(e) => { e.target.onerror = null; e.target.src = poster; }} 
                  style={{ 
                    width: '200px', 
                    height: '300px', 
                    objectFit: 'cover' 
                  }}
                />
                  <h2>{movieObj.movie.name}</h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Category;
