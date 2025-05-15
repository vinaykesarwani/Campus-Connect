import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connections, setConnections] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [replyInputs, setReplyInputs] = useState({});
    const [replies, setReplies] = useState({});
    const [showReplies, setShowReplies] = useState({});

    const handleReplyChange = (postId, value) => {
        setReplyInputs(prev => ({ ...prev, [postId]: value }));
    };

    const handleSendReply = async (postId) => {
        const message = replyInputs[postId];
        if (!message) return;

        try {
            await API.post(`/reply/${postId}`, {
                sender: userId,
                message
            });
            alert('Reply sent!');
            setReplyInputs(prev => ({ ...prev, [postId]: '' }));
            fetchReplies(postId); // Refresh replies
        } catch (err) {
            console.error('Error sending reply', err);
            alert('Failed to send reply.');
        }
    };

    const fetchReplies = async (postId) => {
        try {
            const res = await API.get(`/reply/${postId}`);
            setReplies(prev => ({ ...prev, [postId]: res.data.replies }));
        } catch (err) {
            console.error('Error fetching replies', err);
        }
    };

    const toggleReplies = (postId) => {
        setShowReplies(prev => {
            const updated = { ...prev, [postId]: !prev[postId] };
            if (updated[postId]) fetchReplies(postId);
            return updated;
        });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await API.post('/messages/send', {
                senderId: userId,
                receiverId: selectedUserId,
                message: newMessage
            });

            setConversation(prev => [...prev, {
                sender: userId,
                message: newMessage
            }]);

            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Message send failed.');
        }
    };

    const fetchUserPosts = async () => {
        try {
            const res = await API.get(`/posts/${userId}`);
            setUserPosts(res.data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!title || !content) return alert('Please fill in both fields');

        try {
            await API.post('/posts/create', { title, content, userId });
            setTitle('');
            setContent('');
            fetchUserPosts();
            fetchAllPosts();
        } catch (err) {
            console.error('Error creating post', err);
        }
    };

    const fetchAllPosts = async () => {
        try {
            const res = await API.get(`/posts/users/${userId}`);
            setAllPosts(res.data);
        } catch (error) {
            console.error("Error fetching all posts:", error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await API.delete(`/posts/${postId}`);
            setUserPosts(userPosts.filter(post => post._id !== postId)); // Remove from state
            fetchAllPosts();
        } catch (err) {
            console.error("Failed to delete post", err);
        }
    };
    const fetchConnections = async () => {
        try {
            const res = await API.get(`/messages/${userId}`);
            setConnections(res.data);
        } catch (err) {
            console.error('Failed to fetch connections:', err);
        }
    };

    const fetchConversation = async (otherUserId, otherUserName) => {
        try {
            const res = await API.get(`/messages/${userId}/${otherUserId}`);
            setConversation(res.data);
            setSelectedUserId(otherUserId);
            setSelectedUserName(otherUserName);
        } catch (err) {
            console.error('Error fetching conversation:', err);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate('/signup');
        } else {
            setLoading(true);
            Promise.all([fetchUserPosts(), fetchAllPosts(), fetchConnections()])
                .finally(() => setLoading(false));
        }
    }, [userId]);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 4fr 3fr',
                gap: '20px',
                padding: '20px',
            }}>

                <section style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '8px',
                    height: '80vh',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}>
                    <h3>Your Posts</h3>
                    <form onSubmit={handleCreatePost} style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows="4"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
                        />
                        <button type="submit" style={{
                            padding: '8px 16px',
                            backgroundColor: '#198754',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}>
                            Save
                        </button>
                    </form>
                    {loading ? <p>Loading...</p> : userPosts.length === 0 ? <p>No posts found</p> :
                        userPosts.map(post => (
                            <div key={post._id} style={{ marginBottom: '10px' }}>
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </section>
                <section style={{
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                    height: '80vh',
                    overflowY: 'auto'
                }}>
                    <h3>All Posts</h3>
                    {loading ? <p>Loading...</p> : allPosts.length === 0 ? <p>No posts available</p> :
                        allPosts.map(post => (
                            <div key={post._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>
                                <p style={{ fontStyle: 'italic', color: 'gray', position: 'relative' }}>
                                    By {post.createdBy?.name} ({post.createdBy?.email})
                                    <span style={{ float: 'right' }}>
                                        ({post.createdAt})
                                    </span>
                                </p>

                                <div style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyInputs[post._id] || ''}
                                        onChange={(e) => handleReplyChange(post._id, e.target.value)}
                                        style={{ flex: 1, padding: '6px 10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    />
                                    <button
                                        onClick={() => handleSendReply(post._id)}
                                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                                    >
                                        Reply
                                    </button>
                                    <button
                                        onClick={() => toggleReplies(post._id)}
                                        style={{ padding: '6px 12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                                    >
                                        {showReplies[post._id] ? 'Hide Replies' : 'See Replies'}
                                    </button>
                                </div>

                                {showReplies[post._id] && replies[post._id] && (
                                    <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
                                        {replies[post._id].length === 0 ? (
                                            <p style={{ color: 'gray' }}>No replies yet.</p>
                                        ) : (
                                            replies[post._id].map((reply, idx) => (
                                                <div key={idx} style={{ marginBottom: '6px' }}>
                                                    <strong>{reply.sender?.name || 'Anonymous'}:</strong> {reply.message}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    }
                </section>

                <section style={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '8px',
                    height: '80vh',
                    overflowY: 'auto',
                    display: 'flex',
                    gap: '20px'
                }}>
                    <div style={{ width: '30%' }}>
                        <h3>Messages</h3>
                        {connections.length === 0 ? (
                            <p>No messages yet.</p>
                        ) : (
                            <ul style={{ padding: 0, margin: 0, textAlign: 'center' }}>
                                {connections.map(user => (
                                    <ol
                                        key={user._id}
                                        style={{
                                            padding: '10px',
                                            marginBottom: '8px',
                                            borderRadius: '8px',
                                            backgroundColor: selectedUserId === user._id ? '#e2e6ea' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.3s',
                                            border: '1px solid #ddd'
                                        }}
                                        onClick={() => fetchConversation(user._id, user.name)}
                                    >
                                        {user.name}
                                    </ol>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div style={{
                        flex: 1,
                        backgroundColor: '#ffffff',
                        padding: '10px',
                        borderRadius: '8px',
                        height: '100%',
                        overflowY: 'auto',
                        border: '1px solid #ccc',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {selectedUserId ? (
                            <>
                                <h4>Conversation with {selectedUserName}</h4>
                                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                                    {conversation.length === 0 ? (
                                        <p>No messages yet.</p>
                                    ) : (
                                        conversation.map((msg, idx) => (
                                            <div key={idx} style={{
                                                textAlign: msg.sender === userId ? 'right' : 'left',
                                                marginBottom: '10px'
                                            }}>
                                                <span style={{
                                                    display: 'inline-block',
                                                    backgroundColor: msg.sender === userId ? '#d1e7dd' : '#f1f1f1',
                                                    padding: '8px 12px',
                                                    borderRadius: '15px',
                                                    maxWidth: '60%',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                                }}>
                                                    {msg.message}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Input and Send Button */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        style={{
                                            padding: '8px 12px',
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
                            </>
                        ) : (
                            <p>Select a contact to view messages.</p>
                        )}
                    </div>

                </section>

            </div>
        </div>
    );
};

export default Home;