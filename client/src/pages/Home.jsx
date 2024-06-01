import React from 'react'
import '../style/Home.css';
import Films from './Films';
import NavBar from './NavBar';
import Footer from './Footer';

function Home() {
  
  return (
    <div className="App">
      <NavBar></NavBar>

      <main className="main-content">
        <div className="about-website">
          <h1>Track films you’ve watched.</h1>
          <h2>Save those you want to see.</h2>
          <h2>Tell your friends what’s good.</h2>
          <button className="get-started-button">Get started - it's free</button>
        </div>
      </main>
      <div className='Footer'>
        <Footer/>
      </div>
    </div>
  );
}

export default Home