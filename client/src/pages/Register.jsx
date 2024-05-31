// src/components/Register.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/urubuflix.png';
import '../App.css';
import { register } from '../services/Axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(username,email,password);
      const response = await register(username, email, password);
      if (response.status) {
        alert('Account created successfully!');
        navigate('/');
      } 
      else if (!response.status && response.message === 'user already existed') {
        alert('Account already created, try again');
      } 
      else {
        alert('Some information is incorrect\nTry again');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <img src={logo} alt="urubuflix" />
        <h2>Register</h2>
        <label htmlFor='username'>Username :</label>
        <input
          type='text'
          placeholder='Enter Username'
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor='email'>Email :</label>
        <input
          type='email'
          placeholder='Enter Email'
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor='password'>Password :</label>
        <input
          type='password'
          placeholder='******'
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type='submit'>Register</button>
        <p>Have an Account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
