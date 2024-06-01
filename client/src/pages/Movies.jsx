import React from 'react'
import Films from './Films';
import NavBar from './NavBar';
import Footer from './Footer';


function Movies() {

    return (
        <div>
          <NavBar></NavBar>
          <Films></Films>
          <Footer/>
        </div>
      );
}

export default Movies;