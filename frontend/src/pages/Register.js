import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';
import toyotaImg from '../asset/toyota.jpg';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await api.register({
                username, password, name, email, phone, birthdate
            });
            login(userData);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed. Username may be taken.');
        }
    };

    return (
        <div className="auth-page">
            <header className="page-header">
                <h1>MRF Car Rental</h1>
            </header>
            <div className="auth-card">
                <div className="auth-left">
                    <h2>Create Account</h2>
                    <p>Join us today! Enter your details to get started.</p>
                    {error && <div className="alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    className="input-field"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="input-field"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Birthdate</label>
                                <input
                                    className="input-field"
                                    type="date"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <br />
                        <button type="submit" className="btn-primary">Register</button>
                    </form>

                    <div className="auth-divider">or</div>



                    <div className="auth-footer">
                        <span>Already have an account? </span>
                        <Link to="/login" className="auth-link">Sign In</Link>
                    </div>
                </div>
                <div className="auth-right">
                    <img src={toyotaImg} alt="Toyota C-HR" />

                </div>
            </div>
        </div>
    );
};

export default Register;
