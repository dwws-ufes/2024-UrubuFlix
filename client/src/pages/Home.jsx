import React, { useState, useEffect } from 'react'
import '../style/Home.css';
import {useNavigate } from 'react-router-dom'
import NavBar from './NavBar';
import Footer from './Footer';
import { verifyUser } from '../services/Axios';

function Home() {
  const navigate =  useNavigate()
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await verifyUser();
        if (response.status) {
          setUser(response.user);
          navigate('/movies');
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
    <div className="App">
      <NavBar></NavBar>

      <main className="main-content">
        <div className="about-website">
          <h1>Track films you’ve watched.</h1>
          <h2>Save those you want to see.</h2>
          <h2>Tell your friends what’s good.</h2>
          <div className="register-login">
            <button type="button" title="Register" onClick={handleRegister}>Register</button>
            <button type="button" title="Login" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </main>
      <div className='Footer'>
        <Footer/>
      </div>
    </div>
  );
}

export default Home