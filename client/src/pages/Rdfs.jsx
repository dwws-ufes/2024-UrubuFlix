import React, { useEffect, useState } from 'react';
import {useParams } from 'react-router-dom';
import  Axios  from 'axios';

const Rdfs = () => {
    const { id } = useParams();
    const [content, setcontet] = useState('');
  
    useEffect(() => {
        rdfxml();
      }, [id]);
    
    const rdfxml = async () => {
        try {
            const response = await Axios.get(`http://localhost:3002/rdf/${id}`,{
                withCredentials: true
              });
            setcontet(response.data)
        } catch (err) {
            console.log(err);
        }
        
    }    
      return (
        <div style={{backgroundColor: 'black'}}>
          <pre>{content}</pre>
        </div>
      );
}

export default Rdfs