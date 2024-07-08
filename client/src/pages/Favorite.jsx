import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Link,useParams } from 'react-router-dom';
import  Axios  from 'axios';
import poster from '../assets/posterplaceholder.jpeg';

function Favorite() {
  const { id } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Axios.get(`http://localhost:3002/favorites/${id}`, {
      withCredentials: true
    })
      .then((res) => {
        setCatalog(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div>
        <NavBar />
        <main >
          <div className="title">
            <h2>Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main className='content' style={{ flex: 1 }}>
        <div className="title">
          <h2>{catalog.name}</h2>
          <div className='movie-card' 
            style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              flexWrap: 'wrap', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
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
      </main>
      <Footer/>
    </div>
  );
}

export default Favorite;
