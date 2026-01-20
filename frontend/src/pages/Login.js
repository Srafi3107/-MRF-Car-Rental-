import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api/api';
import toyotaImg from '../asset/toyota.jpg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await api.login(username, password);
            login(userData);
            if (userData.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="auth-page">
            <header className="page-header">
                <h1>MRF Car Rental</h1>
            </header>
            <div className="auth-card">
                <div className="auth-left">
                    <h2>Login</h2>
                    <p>Enter your credentials to access your account.</p>
                    {error && <div className="alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="input-field"
                                type="text"
                                placeholder="Enter your email"
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
                                placeholder="........"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-options">
                            <label>
                                <input type="checkbox" /> Remember me
                            </label>
                        </div>
                        <button type="submit" className="btn-primary">Login</button>
                    </form>

                    <div className="auth-divider">or</div>


                    <div className="auth-footer">
                        <span>Don't have an Account? </span>
                        <Link to="/register" className="auth-link">Sign Up</Link>
                    </div>
                </div>
                <div className="auth-right">
                    <img src={toyotaImg} alt="Toyota C-HR" />

                </div>
            </div>
        </div>
    );
};

export default Login;
