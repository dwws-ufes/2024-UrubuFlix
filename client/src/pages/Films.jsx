import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'

function Films() {
  const navigate =  useNavigate()
  const [film, setFilms] = useState([])

  
  useEffect(() => {
    Axios.get('http://localhost:3002/films')
    .then((res) => {
      if (res.data) {
        setFilms(res.data)
      }else {
        //navigate('/')
        console.log('algum erro');
      }
      
    })
  },[])

  return (
    <div>
      {film.map(film => (
        <li key={film.Title}>{film.Title}</li>
      ))}
    </div>
  )
}

export default Films