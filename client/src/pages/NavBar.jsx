import React, { useState, useEffect } from 'react'
import '../style/Home.css';
import logo from '../assets/urubuflix.png'
import { Link, useNavigate } from 'react-router-dom'
import { verifyUser } from '../services/Axios';
import urubuUser from '../assets/urubu.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function NavBar() {
  const navigate =  useNavigate()
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        if (response.status) {
          setUser(response.user);
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
    
  }
  function handleRegister(){
    navigate('/register')
  }

  return (
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
  )
}

export default NavBar