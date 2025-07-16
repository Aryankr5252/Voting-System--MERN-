import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, setAuth } = useAuth(); // 👈 from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth({ isLoggedIn: false, isAdmin: false, token: null }); // context reset
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-lg">Voting System</h1>

      <div className="space-x-4">
        {auth.isLoggedIn ? (
          <>
            <Link to="/">Vote</Link>
            <Link to="/results">Results</Link>
            {auth.isAdmin && <Link to="/admin">Admin</Link>}
            <button onClick={handleLogout} className="text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;
