import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AnonymousPage = () => {
    const userId = localStorage.getItem('userId');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replyInputs, setReplyInputs] = useState({});
    const [replies, setReplies] = useState({});
    const [openRepliesPostId, setOpenRepliesPostId] = useState(null);
    const [college, setCollege] = useState('');

    useEffect(() => {
        fetchUserCollege(userId);
        fetchAnonymousPosts();
    }, []);

    const fetchUserCollege = async (id) => {
        try {
            const res = await API.get(`/auth/${id}`);
            setCollege(res.data.college);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchAnonymousPosts = async () => {
        try {
            setLoading(true);
            const res = await API.get(`/anonymous/posts/users/${userId}`);
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await API.post('/anonymous/posts/create', {
                title,
                content,
                college
            });
            setTitle('');
            setContent('');
            fetchAnonymousPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleReplyChange = (postId, value) => {
        setReplyInputs(prev => ({ ...prev, [postId]: value }));
    };

    const handleReply = async (postId) => {
        const message = replyInputs[postId];
        if (!message) return;

        try {
            await API.post(`/anonymous/reply/${postId}`, {
                sender: userId,
                content: message
            });
            setReplyInputs(prev => ({ ...prev, [postId]: '' }));
            fetchReplies(postId);
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const fetchReplies = async (postId) => {
        try {
            const res = await API.get(`/anonymous/reply/${postId}`);
            setReplies(prev => ({ ...prev, [postId]: res.data }));
            console.log(setReplies);
        } catch (err) {
            console.error('Error fetching replies:', err);
        }
    };

    const toggleReplies = (postId) => {
        if (openRepliesPostId === postId) {
            setOpenRepliesPostId(null); // hide
        } else {
            fetchReplies(postId);
            setOpenRepliesPostId(postId); // show
        }
    };

    return (
        <div style={{ display: 'flex', height: '90vh', padding: '20px', gap: '20px' }}>
            {/* Create Post Pane */}
            <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h3>Create Anonymous Post</h3>
                <form onSubmit={handleCreatePost}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        required
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                    />
                    <button type="submit" style={{
                        padding: '8px 16px',
                        backgroundColor: '#0d6efd',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px'
                    }}>
                        Submit
                    </button>
                </form>
            </div>

            {/* Posts Pane */}
            <div style={{ flex: 2, background: '#fff', padding: '20px', borderRadius: '8px', overflowY: 'auto' }}>
                <h3>Anonymous Posts</h3>
                {loading ? <p>Loading...</p> :
                    posts.length === 0 ? <p>No posts yet</p> :
                        posts.map(post => (
                            <div key={post._id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                                <h4>{post.title}</h4>
                                <p>{post.content}</p>

                                {/* Reply Input */}
                                <div style={{ marginTop: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Write a reply"
                                        value={replyInputs[post._id] || ''}
                                        onChange={(e) => handleReplyChange(post._id, e.target.value)}
                                        style={{ width: '80%', padding: '6px' }}
                                    />
                                    <button
                                        onClick={() => handleReply(post._id)}
                                        style={{ marginLeft: '10px', padding: '6px 12px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '4px' }}
                                    >
                                        Reply
                                    </button>
                                </div>

                                {/* Toggle Replies */}
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        onClick={() => toggleReplies(post._id)}
                                        style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}
                                    >
                                        {openRepliesPostId === post._id ? 'Hide Replies' : 'See Replies'}
                                    </button>

                                    {/* Replies Section */}
                                    {openRepliesPostId === post._id && Array.isArray(replies[post._id]) && (
                                        <div style={{ marginTop: '10px', paddingLeft: '10px' }}>
                                            {replies[post._id]?.map(reply => (
                                                <div key={reply._id} className="reply" style={{ marginBottom: '8px' }}>
                                                    <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                                                        <span>{reply.message} ({reply.sender.name}) ({reply.sender.email})</span>
                                                        <small style={{ marginLeft: '10px', whiteSpace: 'nowrap', color: '#666' }}>
                                                            {new Date(reply.createdAt).toLocaleString()}
                                                        </small>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                }
            </div>
        </div>
    );
};

export default AnonymousPage;
