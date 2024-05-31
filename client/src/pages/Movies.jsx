import React from 'react'
import '../style/Home.css';
import Films from './Films';
import NavBar from './NavBar';
import Footer from './Footer';

function Movies() {

    return (
        <div className="App">
          <NavBar></NavBar>
    
          <main className="main-content">
            <div className='films'>
              <Films></Films>
            </div>
          </main>
    
          <Footer/>
        </div>
      );
}

export default Movies;