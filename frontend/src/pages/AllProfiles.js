import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AllProfiles = () => {
  const userId = localStorage.getItem('userId');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [users, setUsers] = useState([]);
  const [dmMessages, setDmMessages] = useState({});


  useEffect(() => {
    const fetchBatches = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await API.get(`/batch/${userId}`);
        setBatches(res.data);
      } catch (err) {
        console.error('Error fetching batches', err);
      }
    };
    fetchBatches();
  }, []);

  const sendDM = async (receiverId) => {
    const message = dmMessages[receiverId];
    if (!message || message.trim() === '') return;

    try {
      await API.post('/messages/send', {
        senderId: userId,
        receiverId,
        message
      });
      setDmMessages({ ...dmMessages, [receiverId]: '' });
    } catch (err) {
      console.error('Error sending DM', err);
      alert('Failed to send message.');
    }
  };

  const fetchUsers = async (batch) => {
    const userId = localStorage.getItem('userId');
    setSelectedBatch(batch);
    try {
      const res = await API.get(`/batch/${userId}/${batch}`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  return (
    <div style={{ display: 'flex', height: '90vh' }}>
      {/* Left Pane: Batches */}
      <div style={{
        width: '25%',
        backgroundColor: '#f0f0f0',
        padding: '10px',
        overflowY: 'auto',
        borderRight: '1px solid #ccc'
      }}>
        <h3>Batches</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {batches.map((batch) => (
            <li
              key={batch}
              style={{
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: selectedBatch === batch ? '#dbeafe' : '#fff',
                cursor: 'pointer',
                borderRadius: '8px',
                border: '1px solid #ccc',
                textAlign: 'center'
              }}
              onClick={() => fetchUsers(batch)}
            >
              Batch {batch}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: '75%', padding: '20px', overflowY: 'auto' }}>
        <h3>Profiles - Batch {selectedBatch}</h3>
        {users.length === 0 ? (
          <p>No users found for this batch.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {users.map(user => (
              <div key={user._id} style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                <h4>{user.name}</h4>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>College:</strong> {user.college}</p>
                <p><strong>Company:</strong> {user.company}</p>
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={dmMessages[user._id] || ''}
                    onChange={(e) =>
                      setDmMessages({ ...dmMessages, [user._id]: e.target.value })
                    }
                    style={{
                      padding: '5px',
                      width: 'calc(100% - 80px)',
                      marginRight: '5px',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                  />
                  <button
                    onClick={() => sendDM(user._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProfiles;
