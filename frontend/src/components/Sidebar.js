import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>CarRental</h2>
                <p>Welcome, {user.username}</p>
            </div>

            <nav className="sidebar-nav">
                {user.role === 'ADMIN' ? (
                    <>
                        <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Dashboard</Link>
                        <Link to="/admin/cars" className={isActive('/admin/cars') ? 'active' : ''}>Manage Cars</Link>
                        <Link to="/admin/customers" className={isActive('/admin/customers') ? 'active' : ''}>View Customers</Link>
                        <Link to="/admin/bookings" className={isActive('/admin/bookings') ? 'active' : ''}>View Bookings</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
                        <Link to="/dashboard/book" className={isActive('/dashboard/book') ? 'active' : ''}>Book Cars</Link>
                        <Link to="/dashboard/bookings" className={isActive('/dashboard/bookings') ? 'active' : ''}>My Bookings</Link>
                        <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>My Profile</Link>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;
