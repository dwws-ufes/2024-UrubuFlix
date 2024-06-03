// src/components/User.js
import React, { useEffect, useState } from 'react';
import '../style/User.css';
import urubuUser from '../assets/urubu.png'; 
import { useNavigate } from 'react-router-dom';
import * as axios from '../services/Axios';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.verifyUser();
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

  const handleMovieList = () => {
    navigate('/Favorite');
  }

  const handleChangePassword = () => {
    navigate('/forgotPassword');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.logout();
      if (response.status) {
        if (window.location.pathname === '/') {
          window.location.reload();
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete the account?')) {
      try {
        const response = await axios.deleteAccount();
        if (response.status) {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className='foto-logo'>
      <img
          src={urubuUser}
          alt="Profile"
          className="profile-pic"
        />
      <div className="user-profile">
        
        <h2 style={{ color: 'white' }}>{user.username}</h2>
          <button className="button" onClick={handleMovieList}>
            Movie list
          </button>
          <button className="button" onClick={handleChangePassword}>
            Change password
          </button>
          <button className="button" onClick={handleLogout}>
            Logout
          </button>
          <button className="delete-button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
      </div>
    </div>
    
  );
};

export default User;
