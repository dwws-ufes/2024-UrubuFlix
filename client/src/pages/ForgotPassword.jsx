// src/components/ForgotPassword.js
import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import '../App.css';
import { forgotPassword } from '../services/Axios';
import logo from '../assets/urubuflix.png'
import Footer from './Footer';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword(email);

      if (response.status) {
        alert('Check your email for reset password link');
        navigate('/login');
      } else {
        alert('Some information is incorrect. Try again.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <img src={logo} alt="urubuflix" />
        <h2>Forgot Password</h2>
        <label htmlFor='email'>Email :</label>
        <input
          type='email'
          placeholder='Enter Email'
          autoComplete='off'
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
      <div className="footer">
        <Footer/>
      </div>
    </div>
  );
}

export default ForgotPassword;
