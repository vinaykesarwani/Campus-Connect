import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', formData);
      localStorage.setItem('userId', res.data.userId);
      navigate('/home');
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="college" placeholder="College" value={formData.college} onChange={handleChange} required />
        <input name="batch" type="integer" placeholder="Batch" value={formData.batch} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      {msg && <p>{msg}</p>}

      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Login
        </button>
      </p>
      
    </div>
  );
};

export default Signup;
