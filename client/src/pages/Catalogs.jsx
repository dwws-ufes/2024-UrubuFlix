import React, { useEffect, useState, useRef } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/Catalogs.css'


function Category() {
  const [catalogs, setCatalogs] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef()

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

  const handleScroll = (scrollAmount) => {
    const newScrollPosition = scrollAmount + scrollPosition;
    setScrollPosition(newScrollPosition)
    containerRef.current.scrollLeft = newScrollPosition
  }

return (
    <div className='catalog-grid'>
        {catalogs.map(catalog => (
            <div className='films' key={catalog.id}>
                <h2>{catalog.name}</h2>

                <div className='content-box'>
                    {catalog.catalog_has_movie.map(movieObj => (
                        <div className='card' key={movieObj.movie.id}>
                            <Link to={`/film/${movieObj.movie.id}`} key={movieObj.movie.id}>
                                <img src={movieObj.movie.poster}  />
                                <p>{movieObj.movie.name}</p>
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
