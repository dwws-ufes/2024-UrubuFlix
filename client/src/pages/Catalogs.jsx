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
                <h2>{catalog.name}</h2>
                <div className='movie-card' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {catalog.catalog_has_movie.map(movieObj => (
                        <div className='film-card' key={movieObj.movie.id}>
                            <Link to={`/film/${movieObj.movie.id}`} key={movieObj.movie.id}>
                                <img src={movieObj.movie.poster}  />
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
