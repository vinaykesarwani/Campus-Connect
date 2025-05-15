import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Auth from './components/Auth';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import AllProfiles from './pages/AllProfiles';
import Anonymous from './pages/Anonymous';
import Layout from './components/Layout';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/" element={<Auth />} />
        <Route path="/profile" element={<Layout><ProfilePage /> </Layout>}/>
        <Route path="/profiles" element={<Layout><AllProfiles /> </Layout>}/>
        <Route path="/anonymous" element={<Layout><Anonymous /> </Layout>}/>
      </Routes>
    </Router>
  );
}
export default App;