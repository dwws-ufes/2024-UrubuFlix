import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import { resetPassword } from '../services/Axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await resetPassword(token, password);

      if (response.status) {
        alert('Password reset successfully');
        navigate('/login');
      } 
      else {
        alert('Some information is incorrect. Try again.');
      }
    } 
    catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h2>Reset Password</h2>
        <label htmlFor='password'>New Password :</label>
        <input
          type='password'
          placeholder='******'
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
}

export default ResetPassword;
