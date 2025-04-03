import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import Auth from '../utils/auth';
import { register } from "../api/authAPI";

const Registration = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData({
      ...registrationData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(registrationData);
      Auth.login(data.token);
      navigate('/board');
    } catch (err) {
      console.error('Failed to register', err);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label>Username</label>
        <input 
          type='text'
          name='username'
          value={registrationData.username || ''}
          onChange={handleChange}
        />
        <label>Password</label>
        <input 
          type='password'
          name='password'
          value={registrationData.password || ''}
          onChange={handleChange}
        />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Registration; 