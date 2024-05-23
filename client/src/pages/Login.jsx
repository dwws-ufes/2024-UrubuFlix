// src/components/Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/urubuflix.png';
import '../App.css';
import { login } from '../services/Axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, password);

      if (response.status) {
        navigate('/');
      } 
      else if (!response.status && response.message === 'user already existed') {
        alert('Account already created, try again');
      } 
      else {
        alert('Some information is incorrect\nTry again');
      }
    } 
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <img src={logo} alt="" />
        <h2>Login</h2>
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
        <button type='submit'>Login</button>
        <p><Link className="link" to='/forgotPassword'>Forgot password ? </Link></p>
        <p><Link className="link" to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
