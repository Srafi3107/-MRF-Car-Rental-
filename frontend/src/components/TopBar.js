import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="topbar">
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </div>
    );
};

export default TopBar;
