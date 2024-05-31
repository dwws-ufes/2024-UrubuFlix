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
        
        <div className="title">
          <h1>The best movie review site</h1>
        </div>

        <div className="about-website">
          <div>
            <h1>Do you know what UrubuFlix is?</h1>
          </div>
          <div>
            <p>
              UrubuFlix is ​​a film review service, allowing you to rate and comment on the films you have watched.
            </p>
          </div>
          <div>
            <p>
              You can enjoy all these features:
            </p>
          </div>
          <div className="benefit-box">
            <div>
              <h2>Search movies</h2>
              <p>
                Search for movies you want to watch. You can search by name, category, actors, directors and more.
              </p>
            </div>
            <div>
              <h2>Rate the movie you watched</h2>
              <p>
                Give your rating and comment on the film you watched. Share your opinion with other users.
              </p>
            </div>
            <div>
              <h2>Favorite your favorite movies</h2>
              <p>
                Add the movies you liked most to your favorites list. This way, all the films you liked most will be in one place.
              </p>
            </div>
            <div>
              <h2>Come back whenever you want</h2>
              <p>
                When you miss it and sign up again, your profile will be reactivated with your entire history and list.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}

export default Home