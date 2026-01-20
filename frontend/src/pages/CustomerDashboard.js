import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const CustomerDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/book" element={<BookCars />} />
            <Route path="/bookings" element={<MyBookings />} />
        </Routes>
    );
};

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ availableCars: 0, myBookings: 0, totalSpent: 0 });
    const [chartData, setChartData] = useState({ spending: [], status: [] });

    useEffect(() => {
        const load = async () => {
            const cars = await api.getCars();
            const bookings = await api.getBookings(user.id);
            setStats({
                availableCars: cars.filter(c => c.isAvailable).length,
                myBookings: bookings.length,
                totalSpent: bookings.filter(b => b.status !== 'CANCELLED').reduce((acc, b) => acc + b.totalPrice, 0)
            });

            // Process monthly spending
            const monthlyData = {};
            bookings.filter(b => b.status !== 'CANCELLED').forEach(b => {
                const month = new Date(b.startDate).toLocaleString('default', { month: 'short' });
                monthlyData[month] = (monthlyData[month] || 0) + b.totalPrice;
            });
            const spendingData = Object.keys(monthlyData).map(month => ({
                month,
                amount: monthlyData[month]
            }));

            // Process booking status
            const statusCounts = {};
            bookings.forEach(b => {
                statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
            });
            const statusData = Object.keys(statusCounts).map(status => ({
                name: status,
                value: statusCounts[status]
            }));

            setChartData({ spending: spendingData, status: statusData });
        };
        load();
    }, [user.id]);

    const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#64748b'];

    return (
        <div>
            <h2>Welcome back, {user.username}</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Available Cars</h3>
                    <p className="stat-value">{stats.availableCars}</p>
                </div>
                <div className="stat-card">
                    <h3>My Bookings</h3>
                    <p className="stat-value">{stats.myBookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Spent</h3>
                    <p className="stat-value">${stats.totalSpent.toFixed(2)}</p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h4>My Spending History</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.spending}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#3b82f6" name="Spent ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h4>Booking Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.status}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.status.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const BookCars = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    // Booking Form
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        customerName: user?.name || '',
        customerPhone: user?.phone || ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            api.getCars(search).then(setCars);
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [search]);

    const handleRent = async (e) => {
        e.preventDefault();
        const start = new Date(formData.startDate).getTime();
        const end = new Date(formData.endDate).getTime();

        if (end <= start) {
            setMessage('End date must be after start date');
            return;
        }

        try {
            await api.bookCar({
                userId: user.id,
                carId: selectedCar.id,
                startDate: start,
                endDate: end,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone
            });
            alert('Booking requested! Admin will review your request.');
            navigate('/dashboard/bookings');
        } catch (err) {
            setMessage('Booking failed. Car may be unavailable.');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Book a Car</h3>
                {!selectedCar && (
                    <div className="search-bar">
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Search by brand or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '300px' }}
                        />
                    </div>
                )}
            </div>

            {message && <div className="alert-error">{message}</div>}

            {selectedCar ? (
                <div className="card">
                    <h4>Request Booking for {selectedCar.brand} {selectedCar.model}</h4>
                    <p className="text-secondary">${selectedCar.pricePerDay} / day</p>
                    <form onSubmit={handleRent} className="booking-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input required className="input-field"
                                value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input required className="input-field"
                                value={formData.customerPhone} onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Start Date</label>
                            <input type="date" required className="input-field"
                                value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input type="date" required className="input-field"
                                value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="btn-primary">Request Booking</button>
                            <button type="button" className="btn-secondary" onClick={() => setSelectedCar(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="car-grid">
                    {cars.filter(c => c.isAvailable).map(car => (
                        <div className="car-card" key={car.id}>
                            {car.imageBase64 ? (
                                <img src={car.imageBase64} alt={car.model} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                            )}
                            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4>{car.brand} {car.model}</h4>
                                    <div className="rating-mini">
                                        ⭐ {car.averageRating > 0 ? car.averageRating.toFixed(1) : 'New'}
                                    </div>
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${car.pricePerDay}/day</p>
                                <button className="btn-primary" style={{ marginTop: 'auto' }} onClick={() => setSelectedCar(car)}>Rent Now</button>
                            </div>
                        </div>
                    ))}
                    {cars.filter(c => c.isAvailable).length === 0 && <p>No cars found matching your search.</p>}
                </div>
            )}
        </div>
    );
};

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [ratingModal, setRatingModal] = useState(null); // booking object
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');

    const loadBookings = async () => {
        if (user) api.getBookings(user.id).then(setBookings);
    };

    useEffect(() => {
        loadBookings();
    }, [user]);

    const handleReturn = async (id) => {
        if (window.confirm("Return car?")) {
            await api.returnCar(id);
            loadBookings();
        }
    };

    const handleRate = async (e) => {
        e.preventDefault();
        try {
            await api.rateBooking(ratingModal.id, rating, feedback);
            alert('Thank you for your feedback!');
            setRatingModal(null);
            setRating(5);
            setFeedback('');
            loadBookings();
        } catch (err) {
            alert('Failed to submit rating.');
        }
    };

    const getStatusBadge = (b) => {
        if (b.status === 'PENDING') return <span className="badge bg-warning">Pending</span>;
        if (b.status === 'APPROVED') return <span className="badge bg-primary">Approved</span>;
        if (b.status === 'CANCELLED') return <span className="badge bg-error">Cancelled</span>;
        if (b.status === 'COMPLETED') return <span className="badge bg-success">Completed</span>;
        return <span className="badge bg-secondary">Unknown</span>;
    };

    return (
        <div className="card">
            <h3>My Bookings</h3>
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Car</th>
                        <th>Dates</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id.substring(0, 8)}...</td>
                            <td>{b.carId}</td>
                            <td>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</td>
                            <td>${b.totalPrice}</td>
                            <td>{getStatusBadge(b)}</td>
                            <td>
                                {b.status === 'APPROVED' && !b.isReturned && (
                                    <button className="btn-secondary" onClick={() => handleReturn(b.id)}>Return</button>
                                )}
                                {b.status === 'COMPLETED' && b.rating === 0 && (
                                    <button className="btn-primary btn-sm" onClick={() => setRatingModal(b)}>Rate Card</button>
                                )}
                                {b.status === 'COMPLETED' && b.rating > 0 && (
                                    <span style={{ fontSize: '0.9rem' }}>⭐ {b.rating}</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {ratingModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Rate Your Trip</h4>
                        <form onSubmit={handleRate}>
                            <div className="form-group">
                                <label>Rating (1-5)</label>
                                <select className="input-field" value={rating} onChange={e => setRating(parseInt(e.target.value))}>
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Good</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="1">1 - Poor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Feedback</label>
                                <textarea
                                    className="input-field"
                                    rows="3"
                                    placeholder="Tell us about your experience..."
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                ></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" className="btn-primary">Submit Rating</button>
                                <button type="button" className="btn-secondary" onClick={() => setRatingModal(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
