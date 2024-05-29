import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import '../style/Films.css'

function Films() {
  const [film, setFilms] = useState([])

  
  useEffect(() => {
    Axios.get('http://localhost:3002/films')
    .then((res) => {
      if (res.data) {
        setFilms(res.data)
      }else {
        console.log(error);
      }
    })
  },[])

  return (
    <div className="film-grid">
      {film.map(film => (
        <div key={film.Title} className="film-card">
          <img src={film.Poster} alt={film.Title} />
          <h2>{film.Title}</h2>
        </div>
      ))}
    </div>
  )
}

export default Films