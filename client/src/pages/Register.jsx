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
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await register(username, email, password, confirmPassword);
      if (response.status) {
        alert('Account created successfully!');
        navigate('/');
      } else {
        // Se o status for false, exiba a mensagem de erro
        alert(response.message);
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
        <input type='text' id='username' required onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor='email'>Email :</label>
        <input type='email' id='email' required onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor='password'>Password :</label>
        <input type='password' id='password' required onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor='confirmPassword'>Confirm Password :</label>
        <input type='password' id='confirmPassword' required onChange={(e) => setConfirmPassword(e.target.value)} />
        <button type='submit'>Register</button>
        <Link to='/'>Already have an account?</Link>
      </form>
    </div>
  );
}

export default Register;