import React, { useState, useEffect } from 'react'
import '../style/Home.css';
import logo from '../assets/urubuflix.png'
import { Link, useNavigate } from 'react-router-dom'
import { verifyUser } from '../services/Axios';
import urubuUser from '../assets/urubu.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import User from './User'


function NavBar() {
  const navigate =  useNavigate()
  const [user, setUser] = useState()
  const [showComponent, setShowComponent] = useState(false);
  

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

  function mudar(){
    setShowComponent(true)
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
              {user ? <p></p> : <li><Link to='/'>Home</Link></li>}
              <li><Link to='/movies'>Movies</Link></li>
              <li><Link to='/category'>Category</Link></li>
              {user ? <li><Link to='/favorite'>Favorite</Link></li> : <p></p>}
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
        
        {user ?
            <User/>
         : 
        <div className="top-right">
        </div>
        }
      </header>
  )
}

export default NavBar