import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { api } from '../api/api';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/cars" element={<CarManager />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/bookings" element={<BookingList />} />
        </Routes>
    );
};

const DashboardHome = () => {
    const [stats, setStats] = useState({ users: 0, cars: 0, bookings: 0, earnings: 0 });
    const [chartData, setChartData] = useState({ revenue: [], carStatus: [] });

    useEffect(() => {
        const load = async () => {
            const users = await api.getUsers();
            const cars = await api.getCars();
            const bookings = await api.getBookings(); // all bookings

            setStats({
                users: users.length,
                cars: cars.length,
                bookings: bookings.length,
                earnings: bookings.reduce((acc, b) => acc + (b.status === 'CANCELLED' ? 0 : b.totalPrice), 0)
            });

            // Process revenue by car
            const revenueByCar = cars.map(car => ({
                name: `${car.brand} ${car.model}`,
                revenue: bookings
                    .filter(b => b.carId === car.id && b.status !== 'CANCELLED')
                    .reduce((acc, b) => acc + b.totalPrice, 0)
            })).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

            // Process car status
            const statusData = [
                { name: 'Available', value: cars.filter(c => c.isAvailable).length },
                { name: 'Rented', value: cars.filter(c => !c.isAvailable).length }
            ];

            setChartData({ revenue: revenueByCar, carStatus: statusData });
        };
        load();
    }, []);

    const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.users}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Cars</h3>
                    <p className="stat-value">{stats.cars}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Bookings</h3>
                    <p className="stat-value">{stats.bookings}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Earnings</h3>
                    <p className="stat-value">${stats.earnings.toFixed(2)}</p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h4>Top 5 Revenue Generating Cars</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.revenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h4>Fleet Status</h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.carStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.carStatus.map((entry, index) => (
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

const CarManager = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ brand: '', model: '', pricePerDay: '', imageBase64: '' });

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            api.getCars(search).then(setCars);
        }, 300);
        return () => clearTimeout(delaySearch);
    }, [search]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setForm({ ...form, imageBase64: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.addCar(form);
            setForm({ brand: '', model: '', pricePerDay: '', imageBase64: '' });
            api.getCars(search).then(setCars);
        } catch (err) { alert('Failed to add car'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete car?')) {
            await api.deleteCar(id);
            api.getCars(search).then(setCars);
        }
    };

    return (
        <div>
            <div className="card">
                <h3>Add New Car</h3>
                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="form-group">
                        <input className="input-field" placeholder="Brand" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input className="input-field" placeholder="Model" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input className="input-field" type="number" placeholder="Price" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <input className="input-field" type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <button type="submit" className="btn-primary">Add Car</button>
                </form>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Manage Cars</h3>
                <div className="search-bar">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Search cars..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '300px' }}
                    />
                </div>
            </div>

            <div className="car-grid" style={{ marginTop: '20px' }}>
                {cars.map(c => (
                    <div key={c.id} className="car-card">
                        {c.imageBase64 ? (
                            <img src={c.imageBase64} alt={c.model} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ height: '180px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                        )}
                        <div style={{ padding: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h4>{c.brand} {c.model}</h4>
                                <span>⭐ {c.averageRating > 0 ? c.averageRating.toFixed(1) : 'N/A'}</span>
                            </div>
                            <p>${c.pricePerDay}/day</p>
                            <span className={`badge ${c.isAvailable ? 'bg-success' : 'bg-danger'}`}>{c.isAvailable ? 'Available' : 'Rented'}</span>
                            {c.isAvailable && <button onClick={() => handleDelete(c.id)} className="btn-danger" style={{ display: 'block', marginTop: '10px' }}>Delete</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomerList = () => {
    const [users, setUsers] = useState([]);
    const fetchUsers = () => api.getUsers().then(setUsers);
    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete customer account? This cannot be undone.")) {
            try {
                await api.deleteUser(id);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete customer.');
            }
        }
    };

    return (
        <div className="card">
            <h3>Registered Customers</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name || '-'}</td>
                            <td>{u.username}</td>
                            <td>{u.email || '-'}</td>
                            <td>{u.phone || '-'}</td>
                            <td>
                                <button className="btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const fetchBookings = () => api.getBookings().then(setBookings);
    useEffect(() => { fetchBookings(); }, []);

    const handleApprove = async (id) => {
        try {
            await api.approveBooking(id);
            fetchBookings();
        } catch (err) { alert('Approval failed'); }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Cancel this booking?")) {
            try {
                await api.cancelBooking(id);
                fetchBookings();
            } catch (err) { alert('Cancellation failed'); }
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
            <h3>All Bookings</h3>
            <table>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Customer</th>
                        <th>Car ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id.substring(0, 8)}</td>
                            <td>
                                <div>{b.customerName || b.userId}</div>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{b.customerPhone}</div>
                            </td>
                            <td>{b.carId}</td>
                            <td>${b.totalPrice}</td>
                            <td>{getStatusBadge(b)}</td>
                            <td>
                                {b.status === 'PENDING' && (
                                    <>
                                        <button className="btn-primary btn-sm" onClick={() => handleApprove(b.id)}>Approve</button>
                                        <button className="btn-secondary btn-sm" style={{ marginLeft: '5px' }} onClick={() => handleCancel(b.id)}>Cancel</button>
                                    </>
                                )}
                                {b.status === 'APPROVED' && (
                                    <button className="btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
