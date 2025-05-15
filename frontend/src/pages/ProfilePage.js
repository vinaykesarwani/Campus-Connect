import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.log("User ID not found");
      navigate('/signup');
      return;
    }
    else{
      console.log("User ID found");
    }

    const fetchUserDetails = async () => {
      try {
        const response = await API.get(`/auth?userId=${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        navigate('/signup');
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/signup');
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div style={styles.container}>
      <h2>Profile</h2>
      <div style={styles.detailsBox}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>College:</strong> {user.college}</p>
        <p><strong>Batch:</strong> {user.batch}</p>
        <p><strong>Company:</strong> {user.company}</p>
      </div>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'left',
  },
  detailsBox: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default ProfilePage;