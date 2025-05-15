import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('userId', res.data.userId);
      navigate('/home');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Login failed');
    }
  };

  
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleEmailChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {msg && <p>{msg}</p>}

      <p>
        Don't have an account?{' '}
        <button onClick={() => navigate('/signup')} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Sign up
        </button>
      </p>

    </div>
  );
};

export default Login;
