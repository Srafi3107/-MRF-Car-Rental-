import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [birthdate, setBirthdate] = useState(user?.birthdate || '');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const updatedUser = await api.updateProfile(user.id, {
                name, email, phone, birthdate
            });
            login(updatedUser); // Update local state
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            <p className="subtitle">View and manage your personal information.</p>

            <div className="profile-layout">
                {/* Read-only Section */}
                <div className="card profile-summary">
                    <div className="profile-summary-header">
                        <div className="profile-avatar">
                            
                        </div>
                
                    </div>

                    <div className="summary-details">
                        <div className="summary-item">
                            <div className="details">
                                <label>Username:  </label>
                                <span className="value">{user?.username}</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="details">
                                <label>Email Address:  </label>
                                <span className="value">{user?.email || 'Not provided'}</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="details">
                                <label>Phone Number:  </label>
                                <span className="value">{user?.phone || 'Not provided'}</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="details">
                                <label>Birth Date:  </label>
                                <span className="value">{user?.birthdate || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Section */}
                <div className="card profile-edit">
                    <h3>Update Information</h3>
                    {message && <div className="alert-success">{message}</div>}
                    {error && <div className="alert-error">{error}</div>}

                    <form onSubmit={handleUpdate} className="profile-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="input-field"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                className="input-field"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Birth Date</label>
                                <input
                                    className="input-field"
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
