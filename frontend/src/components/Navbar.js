// components/Navbar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0d6efd',
      color: 'white',
      padding: '10px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '45px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>CampusConnect</div>
        <div style={{ display: 'flex', gap: '45px' }}>
          <button className="tab-button" onClick={() => navigate('/home')}>Home</button>
          <button className="tab-button" onClick={() => navigate('/profiles')}>Profiles</button>
          <button className="tab-button" onClick={() => navigate('/anonymous')}>Anonymous</button>
        </div>
      </div>
      <div>
        <button className="tab-button" onClick={() => navigate('/profile')}>Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;
