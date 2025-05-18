import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    batch: '',
    company: '',
  });
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
    <div
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1573164574397-4e1f9e8f9b6b")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Segoe UI, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          width: '400px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyle} />
          <input name="college" placeholder="College" value={formData.college} onChange={handleChange} required style={inputStyle} />
          <input name="batch" type="number" placeholder="Batch" value={formData.batch} onChange={handleChange} required style={inputStyle} />
          <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required style={inputStyle} />

          <button type="submit" style={buttonStyle}>Sign Up</button>
        </form>
        {msg && <p style={{ color: 'red', marginTop: '10px' }}>{msg}</p>}

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/')}
            style={{
              color: '#007BFF',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '16px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '16px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
};

export default Signup;