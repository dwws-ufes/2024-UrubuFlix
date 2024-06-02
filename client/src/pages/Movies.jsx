import React from 'react'
import Films from './Films';
import NavBar from './NavBar';
import Footer from './Footer';

function Movies() {

    return (
        <div>
          <div className='navbar'>
            <NavBar/>
          </div>
            <main className='container'>
              <Films/>
            </main>
          <div className='footer'>
            <Footer/>
          </div> 
        </div>
      );
}

export default Movies;