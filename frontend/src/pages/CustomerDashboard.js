import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard, Car as CarIcon, History, Settings,
    Compass, X, Star, Calendar, DollarSign, Clock, CheckCircle, XCircle
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { toast } from "sonner";

/* ─── Shared Styles ─────────────────────────────────────────── */
const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "1.25rem",
    overflow: "hidden",
};

const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "0.6rem 1rem",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    outline: "none",
};

const labelStyle = {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "0.35rem",
    display: "block",
};

/* ─── Booking Modal ──────────────────────────────────────────── */
const BookingModal = ({ car, user, onClose, onBooked }) => {
    const [form, setForm] = useState({ startDate: "", endDate: "", customerName: user?.name || "", customerPhone: "" });
    const [submitting, setSubmitting] = useState(false);

    const calcDays = () => {
        if (!form.startDate || !form.endDate) return 0;
        const diff = new Date(form.endDate) - new Date(form.startDate);
        return Math.max(0, Math.ceil(diff / 86400000));
    };

    const days = calcDays();
    const total = days * car.pricePerDay;

    const handleBook = async (e) => {
        e.preventDefault();
        if (days < 1) { toast.error("Return date must be after pickup date"); return; }
        setSubmitting(true);
        try {
            await api.bookCar({
                userId: user.id,
                carId: car.id,
                startDate: form.startDate,
                endDate: form.endDate,
                totalPrice: total,
                customerName: form.customerName,
                customerPhone: form.customerPhone,
            });
            toast.success("🎉 Booking confirmed!", { description: `${car.brand} ${car.model} booked for ${days} day(s)` });
            onBooked();
            onClose();
        } catch (err) {
            toast.error("Booking failed", { description: err.message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={onClose}>
            <div style={{
                background: "linear-gradient(135deg, #0f2044 0%, #0a192f 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "1.5rem",
                padding: "2rem",
                width: "100%",
                maxWidth: "30rem",
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>Book This Car</h3>
                        <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                            {car.brand} {car.model} — ${car.pricePerDay}/day
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
                </div>

                {/* Car preview */}
                <img
                    src={car.imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"}
                    alt={car.model}
                    style={{ width: "100%", height: "10rem", objectFit: "cover", borderRadius: "12px", marginBottom: "1.5rem" }}
                />

                <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    {/* Customer info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Your Name *</label>
                            <input style={inputStyle} placeholder="John Doe"
                                value={form.customerName}
                                onChange={e => setForm({ ...form, customerName: e.target.value })} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone Number</label>
                            <input style={inputStyle} placeholder="+1 555 0000"
                                value={form.customerPhone}
                                onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
                        </div>
                    </div>
                    {/* Dates */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Pickup Date *</label>
                            <input type="date" style={inputStyle}
                                min={new Date().toISOString().split("T")[0]}
                                value={form.startDate}
                                onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Return Date *</label>
                            <input type="date" style={inputStyle}
                                min={form.startDate || new Date().toISOString().split("T")[0]}
                                value={form.endDate}
                                onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                        </div>
                    </div>

                    {/* Price summary */}
                    {days > 0 && (
                        <div style={{
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            borderRadius: "12px",
                            padding: "1rem 1.25rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <div>
                                <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{days} day(s) × ${car.pricePerDay}</p>
                                <p style={{ color: "#fff", fontWeight: 800, fontSize: "1.25rem", marginTop: "2px" }}>
                                    Total: ${total.toFixed(2)}
                                </p>
                            </div>
                            <Calendar size={28} style={{ color: "var(--col-primary)", opacity: 0.7 }} />
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <Button type="button" variant="glass" className="btn-full" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" className="btn-full" disabled={submitting || days < 1}>
                            {submitting ? "Booking…" : `Confirm Booking`}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Rating Modal ───────────────────────────────────────────── */
const RatingModal = ({ booking, onClose, onRated }) => {
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.rateBooking(booking.id, rating, feedback);
            toast.success("Rating submitted!");
            onRated();
            onClose();
        } catch { toast.error("Failed to submit rating"); }
        finally { setSubmitting(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
            <div style={{ background: "linear-gradient(135deg, #0f2044, #0a192f)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: "26rem" }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1.125rem" }}>Rate Your Experience</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                        <label style={labelStyle}>Rating</label>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} type="button" onClick={() => setRating(n)} style={{
                                    background: "none", border: "none", cursor: "pointer", padding: "4px",
                                    color: n <= rating ? "#fbbf24" : "#4b5563", fontSize: "1.75rem",
                                }}>★</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Feedback (optional)</label>
                        <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                            placeholder="Share your experience…" value={feedback}
                            onChange={e => setFeedback(e.target.value)} />
                    </div>
                    <Button type="submit" variant="primary" className="btn-full" disabled={submitting}>
                        {submitting ? "Submitting…" : "Submit Rating"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

/* ─── Main Customer Dashboard ────────────────────────────────── */
const CustomerDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
        { name: "Rent a Car", path: "/dashboard/book", icon: <Compass size={16} /> },
        { name: "My Trips", path: "/dashboard/bookings", icon: <History size={16} /> },
        { name: "Profile", path: "/profile", icon: <Settings size={16} /> },
    ];

    const isActive = (p) => location.pathname === p;

    return (
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
            {/* Header + Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", marginBottom: "2.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em" }}>My Journey</h1>
                    <p style={{ color: "#94a3b8", marginTop: "0.25rem" }}>Manage your rentals and explore the fleet</p>
                </div>
                <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", gap: "4px", overflowX: "auto" }}>
                    {tabs.map(tab => (
                        <button key={tab.path} onClick={() => navigate(tab.path)} style={{
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.5rem 1.1rem", borderRadius: "9px",
                            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                            whiteSpace: "nowrap", border: "none",
                            background: isActive(tab.path) ? "var(--col-primary)" : "transparent",
                            color: isActive(tab.path) ? "#fff" : "#94a3b8",
                            transition: "all 0.2s",
                        }}>
                            {tab.icon} {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/book" element={<BookCars />} />
                <Route path="/bookings" element={<MyBookings />} />
            </Routes>
        </div>
    );
};

/* ─── Overview ───────────────────────────────────────────────── */
const DashboardHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getBookings(user?.id)
            .then(data => setBookings(Array.isArray(data) ? data : []))
            .catch(() => toast.error("Could not load booking history"))
            .finally(() => setLoading(false));
    }, [user]);

    const active = bookings.filter(b => b.status === "APPROVED");
    const total = bookings.length;
    const spent = bookings.filter(b => b.status !== "CANCELLED").reduce((a, b) => a + (b.totalPrice || 0), 0);
    const recent = bookings.slice(-4).reverse();

    const statCards = [
        { title: "Total Trips", value: total, icon: <CarIcon size={22} />, color: "var(--col-primary)" },
        { title: "Active Bookings", value: active.length, icon: <Calendar size={22} />, color: "#10b981" },
        { title: "Total Spent", value: `$${spent}`, icon: <DollarSign size={22} />, color: "#f59e0b" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Welcome banner */}
            <div style={{
                padding: "2rem",
                background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(99,102,241,0.08) 100%)",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "1.25rem",
            }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>
                    Welcome back, <span style={{ color: "var(--col-primary)" }}>{user?.name || user?.username}</span> 👋
                </h2>
                <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>Ready for your next adventure?</p>
                <Button variant="primary" style={{ marginTop: "1.25rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }} onClick={() => navigate("/dashboard/book")}>
                    <Compass size={18} /> Browse Cars
                </Button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ ...card, padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ padding: "0.75rem", background: s.color + "22", borderRadius: "12px", color: s.color, flexShrink: 0 }}>{s.icon}</div>
                        <div>
                            <p style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.title}</p>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff" }}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div>
                <h3 style={{ fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Recent Bookings</h3>
                {loading ? <p style={{ color: "#64748b" }}>Loading…</p> : recent.length === 0 ? (
                    <div style={{ ...card, padding: "3rem", textAlign: "center" }}>
                        <p style={{ color: "#64748b" }}>No bookings yet.</p>
                        <Button variant="primary" style={{ marginTop: "1rem" }} onClick={() => navigate("/dashboard/book")}>Rent a Car</Button>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {recent.map(b => (
                            <div key={b.id} style={{ ...card, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{ padding: "0.75rem", background: "rgba(255,255,255,0.06)", borderRadius: "10px" }}>
                                        <CarIcon size={20} style={{ color: "var(--col-primary)" }} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, color: "#fff", fontSize: "0.9rem" }}>Booking #{b.id?.slice(-6)}</p>
                                        <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{b.startDate} → {b.endDate}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <span style={{ fontWeight: 700, color: "#fff" }}>${b.totalPrice}</span>
                                    <Badge variant={b.status === "COMPLETED" ? "success" : b.status === "CANCELLED" ? "danger" : b.status === "APPROVED" ? "default" : "warning"}>
                                        {b.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ─── Book Cars ──────────────────────────────────────────────── */
const BookCars = () => {
    const { user } = useAuth();
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        api.getCars()
            .then(data => setCars(Array.isArray(data) ? data : []))
            .catch(() => toast.error("Could not load fleet"))
            .finally(() => setLoading(false));
    }, []);

    const brands = ["All", ...new Set(cars.map(c => c.brand))];
    const filtered = cars.filter(c => {
        const q = search.toLowerCase();
        return (c.brand?.toLowerCase().includes(q) || c.model?.toLowerCase().includes(q))
            && (filter === "All" || c.brand === filter);
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Search + Filter */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <div style={{ position: "relative", flex: "1 1 200px" }}>
                    <input
                        style={{ ...inputStyle, paddingLeft: "2.5rem" }}
                        placeholder="Search cars…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>🔍</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {brands.map(b => (
                        <button key={b} onClick={() => setFilter(b)} style={{
                            padding: "0.4rem 1rem", borderRadius: "999px", border: "none", cursor: "pointer",
                            fontSize: "0.8rem", fontWeight: 600,
                            background: filter === b ? "var(--col-primary)" : "rgba(255,255,255,0.06)",
                            color: filter === b ? "#fff" : "#94a3b8",
                            transition: "all 0.2s",
                        }}>{b}</button>
                    ))}
                </div>
            </div>

            {loading && <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading fleet…</p>}

            {/* Cars Grid */}
            {!loading && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {filtered.map(car => (
                        <div key={car.id} style={{ ...card, display: "flex", flexDirection: "column" }}>
                            <div style={{ position: "relative", height: "10rem", overflow: "hidden" }}>
                                <img
                                    src={car.imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"}
                                    alt={car.model}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                                />
                                <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                                    <Badge variant={car.isAvailable ? "success" : "danger"}>
                                        {car.isAvailable ? "Available" : "Booked"}
                                    </Badge>
                                </div>
                            </div>
                            <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h4 style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>{car.brand} {car.model}</h4>
                                        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>★ {car.averageRating > 0 ? car.averageRating.toFixed(1) : "5.0"}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontWeight: 800, color: "#fff" }}>${car.pricePerDay}</span>
                                        <span style={{ fontSize: "0.7rem", color: "#64748b", display: "block" }}>/day</span>
                                    </div>
                                </div>
                                <Button
                                    variant={car.isAvailable ? "primary" : "glass"}
                                    className="btn-full"
                                    disabled={!car.isAvailable}
                                    onClick={() => car.isAvailable && setSelectedCar(car)}
                                >
                                    {car.isAvailable ? "Rent Now" : "Unavailable"}
                                </Button>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "3rem", color: "#64748b" }}>
                            No cars match your search.
                        </div>
                    )}
                </div>
            )}

            {selectedCar && (
                <BookingModal
                    car={selectedCar}
                    user={user}
                    onClose={() => setSelectedCar(null)}
                    onBooked={() => {
                        setSelectedCar(null);
                        // refresh availability
                        api.getCars().then(d => setCars(Array.isArray(d) ? d : []));
                    }}
                />
            )}
        </div>
    );
};

/* ─── My Bookings ────────────────────────────────────────────── */
const MyBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratingTarget, setRatingTarget] = useState(null);

    const load = () => {
        setLoading(true);
        api.getBookings(user?.id)
            .then(d => setBookings(Array.isArray(d) ? d : []))
            .catch(() => toast.error("Could not load your bookings"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try { await api.cancelBooking(id); toast.success("Booking cancelled"); load(); }
        catch { toast.error("Could not cancel booking"); }
    };

    const handleReturn = async (id) => {
        if (!window.confirm("Mark this car as returned?")) return;
        try { await api.returnCar(id); toast.success("Car returned successfully!"); load(); }
        catch { toast.error("Return failed"); }
    };

    if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading trips…</p>;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontWeight: 700, color: "#fff" }}>My Bookings ({bookings.length})</h3>

            {bookings.length === 0 && (
                <div style={{ ...card, padding: "3rem", textAlign: "center" }}>
                    <CarIcon size={48} style={{ color: "#334155", margin: "0 auto 1rem" }} />
                    <p style={{ color: "#64748b" }}>You haven't made any bookings yet.</p>
                </div>
            )}

            {bookings.map(b => (
                <div key={b.id} style={{ ...card, padding: "1.25rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                        {/* Info */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{
                                padding: "0.75rem", borderRadius: "12px",
                                background: b.status === "COMPLETED" ? "rgba(16,185,129,0.15)" :
                                    b.status === "CANCELLED" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                            }}>
                                {b.status === "COMPLETED" ? <CheckCircle size={22} style={{ color: "#10b981" }} /> :
                                    b.status === "CANCELLED" ? <XCircle size={22} style={{ color: "#ef4444" }} /> :
                                        <Clock size={22} style={{ color: "var(--col-primary)" }} />}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, color: "#fff" }}>
                                    Booking #{b.id?.slice(-6)} <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: "0.8rem" }}>— Car #{b.carId?.slice(-6)}</span>
                                </p>
                                <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
                                    {b.startDate} → {b.endDate}
                                </p>
                            </div>
                        </div>

                        {/* Status + Amount */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 800, color: "#fff", fontSize: "1.1rem" }}>${b.totalPrice}</span>
                            <Badge variant={
                                b.status === "COMPLETED" ? "success" :
                                    b.status === "CANCELLED" ? "danger" :
                                        b.status === "APPROVED" ? "default" : "warning"
                            }>{b.status}</Badge>

                            {/* Actions */}
                            {(b.status === "PENDING" || b.status === "APPROVED") && (
                                <Button variant="outline" size="sm" onClick={() => handleCancel(b.id)}>Cancel</Button>
                            )}
                            {b.status === "APPROVED" && (
                                <Button variant="primary" size="sm" onClick={() => handleReturn(b.id)}>Return Car</Button>
                            )}
                            {b.status === "COMPLETED" && !b.rated && (
                                <Button variant="glass" size="sm" onClick={() => setRatingTarget(b)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                    <Star size={14} /> Rate
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {ratingTarget && (
                <RatingModal
                    booking={ratingTarget}
                    onClose={() => setRatingTarget(null)}
                    onRated={load}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;
