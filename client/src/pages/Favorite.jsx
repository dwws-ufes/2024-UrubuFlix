import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Link,useParams } from 'react-router-dom';
import  Axios  from 'axios';

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
      <div className="App">
        <NavBar />
        <main className="main-content">
          <div className="title">
            <h2>Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar />
      <main className="main-content">
        <div className="title">
          <div className='films' key={catalog.id}>
            <h2>{catalog.name}</h2>
            <div className='movie-card' style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {catalog.catalog_has_movie.map(movieObj => (
                <div className='film-card' key={movieObj.movie.id}>
                  <Link to={`/film/${movieObj.movie.id}`} key={movieObj.movie.id}>
                    <img src={movieObj.movie.poster} alt={movieObj.movie.name} />
                    <h2>{movieObj.movie.name}</h2>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Favorite;
