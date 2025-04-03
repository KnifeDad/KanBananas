import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";

import { register } from "../api/authAPI";

const Registration = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(userData);
      console.log('Registration successful:', data);
    } catch (err) {
      console.error('Failed to register', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us to start managing your tasks</p>
        </div>
        <div className="auth-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-square"></div>
          <div className="decoration-triangle"></div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text"
              name="username"
              value={userData.username || ''}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password"
              name="password"
              value={userData.password || ''}
              onChange={handleChange}
              placeholder="Choose a password"
              required
            />
          </div>
          <button type="submit" className="auth-button">Register</button>
          <p className="auth-redirect">
            Already have an account? <Link to="/">Log in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration; 