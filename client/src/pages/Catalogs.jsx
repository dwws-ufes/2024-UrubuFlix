import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';


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
                <img className='film-poster'
                    src={movieObj.movie.poster} 
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
