import React from 'react'
import '../style/Home.css';
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
            <Footer/>
        </div>
      );
}

export default Movies;