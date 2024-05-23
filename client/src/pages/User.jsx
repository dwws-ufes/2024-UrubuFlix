// src/components/User.js
import React, { useEffect, useState } from 'react';
import '../style/User.css';
import defaultProfilePic from '../assets/urubu.png'; // Importando a imagem diretamente
import { useNavigate } from 'react-router-dom';
import { verifyUser, logout, deleteAccount } from '../services/Axios';

const User = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

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

  const handleChangePassword = () => {
    navigate('/forgotPassword');
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.status) {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Tem certeza que deseja deletar a conta?')) {
      try {
        const response = await deleteAccount();
        if (response.status) {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="user-profile">
      <img
        src={defaultProfilePic}
        alt="Profile"
        className="profile-pic"
      />
      <h2 className="username">{user.username}</h2>
      <button className="button" onClick={() => alert('Lista de Filmes')}>
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
  );
};

export default User;
