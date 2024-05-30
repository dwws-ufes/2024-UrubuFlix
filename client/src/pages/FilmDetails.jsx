import React from 'react';
import { useParams } from 'react-router-dom';

const FilmDetails = () => {
  let { id } = useParams();


  return (
    <div>
      <h1>Film Details</h1>
      <p>ID: {id}</p>
    </div>
  );
}

export default FilmDetails;