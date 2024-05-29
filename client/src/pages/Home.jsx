import React, { useState, useEffect } from 'react'
import '../style/Home.css';
import logo from '../assets/urubuflix.png'
import { Link, useNavigate } from 'react-router-dom'
import { verifyUser } from '../services/Axios';
import urubuUser from '../assets/urubu.png';
import Films from './Films';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function Home() {
  const navigate =  useNavigate()
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        if (response.status) {
          setUser(response.user);
        } 
        else {
          navigate('/');
        }
      } 
      catch (error) {
        console.log(error);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  function handleLogin(){
    navigate('/login')
    console.log(user);
  }
  function handleRegister(){
    navigate('/register')
  }
  
  return (
    <div className="App">
      <header className="top flex-content">
        <div className="top-left flex-content">
          <div className="top-logo">
            <img src={logo} alt="UrubuFlix logo" title="UrubuFlix logo" />
          </div>
        </div>
        <div className="top-center flex-content">
          <nav>
            <ul className="top-menu flex-content">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/'>Movies</Link></li>
              <li><Link to='/'>Category</Link></li>
              {user ? <li><Link to='/'>Favorite</Link></li> : <p></p>}
            </ul>
          </nav>
          <div className="top-search">
            <div className="content-search">
              <form className="flex-content" method="post">
                <fieldset className="search-bar">
                  <input type="text" placeholder="Search for a movie..." alt="Enter a movie to search here" />
                </fieldset>
                <fieldset className="flex-content">
                <button type="button" title="Search" className="search-button">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
        
        {user ? <Link to='/user'><img src={urubuUser} alt="urubuflix"/></Link> : 
        <div className="top-right">
          <div className="sublogin">
            <div>
              <button className="subloginbtn">Login <br />or Register <span className="fa fa-caret-down"></span></button>
            </div>
            <div className="sublogin-content">
              <button type="button" title="Login" onClick={handleLogin}>Login</button>
              <p>or</p>
              <button type="button" title="Register" onClick={handleRegister}>Register</button>
            </div>
          </div>
        </div>
        }
      </header>

      <main className="main-content">
        <div className='films'>
          <Films></Films>
        </div>
      
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

      <footer>
        <div className="site-map flex-content">
          <div>
            <img src={logo} alt="UrubuFLix logo" title="UrubuFLix logo" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home