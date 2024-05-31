import React from 'react'
import Films from './Films';
import NavBar from './NavBar';
import Footer from './Footer';

function Favorite() {

    return (
        <div className="App">
          <NavBar></NavBar>
  
          <main className="main-content">
            
            <div className="title">
              <h1>TODO (Favorites)</h1>
            </div>
          </main>
  
          <Footer/>
        </div>
    );
}

export default Favorite;