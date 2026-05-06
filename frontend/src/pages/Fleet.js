import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import { Search, Filter, Image as ImageIcon, ImageOff, Fuel, Gauge, Users, Calendar } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/* ─── Booking Modal (inline in Fleet for unauthenticated redirect support) ── */
const inputStyle = {
    width: "100%",
    background: "rgba(0,0,0,0.03)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "10px",
    padding: "0.6rem 1rem",
    color: "var(--col-foreground)",
    fontSize: "0.875rem",
    outline: "none",
};

const labelStyle = {
    fontSize: "0.7rem", fontWeight: 700, color: "var(--col-muted)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    marginBottom: "0.35rem", display: "block",
};

const FleetBookingModal = ({ car, user, onClose, onBooked }) => {
    const [form, setForm] = useState({ startDate: "", endDate: "", customerName: user?.name || "", customerPhone: "" });
    const [submitting, setSubmitting] = useState(false);

    const days = (() => {
        if (!form.startDate || !form.endDate) return 0;
        return Math.max(0, Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / 86400000));
    })();

    const total = days * car.pricePerDay;

    const handleBook = async (e) => {
        e.preventDefault();
        if (days < 1) { toast.error("Return date must be after pickup date"); return; }
        setSubmitting(true);
        try {
            await api.bookCar({
                userId: user.id, carId: car.id,
                startDate: form.startDate, endDate: form.endDate,
                totalPrice: total,
                customerName: form.customerName,
                customerPhone: form.customerPhone,
            });
            toast.success("🎉 Booking confirmed!", { description: `${car.brand} ${car.model} for ${days} day(s)` });
            onBooked();
            onClose();
        } catch (err) {
            toast.error("Booking failed", { description: err.message });
        } finally { setSubmitting(false); }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
            <div style={{ background: "var(--col-bg)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: "28rem" }} onClick={e => e.stopPropagation()}>
                <h3 style={{ color: "var(--col-foreground)", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.25rem" }}>Book {car.brand} {car.model}</h3>
                <p style={{ color: "var(--col-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>${car.pricePerDay} / day</p>
                <img src={car.imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"} alt="" style={{ width: "100%", height: "9rem", objectFit: "cover", borderRadius: "10px", marginBottom: "1.5rem" }} />
                <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={labelStyle}>Your Name *</label>
                            <input style={inputStyle} placeholder="John Doe" required
                                value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                        </div>
                        <div>
                            <label style={labelStyle}>Phone</label>
                            <input style={inputStyle} placeholder="+1 555 0000"
                                value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                        <div>
                            <label style={labelStyle}>Pickup Date</label>
                            <input type="date" style={inputStyle} min={new Date().toISOString().split("T")[0]} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Return Date</label>
                            <input type="date" style={inputStyle} min={form.startDate || new Date().toISOString().split("T")[0]} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                        </div>
                    </div>
                    {days > 0 && (
                        <div style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "10px", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "var(--col-muted)", fontSize: "0.875rem" }}>{days} day(s) × ${car.pricePerDay}</span>
                            <span style={{ color: "var(--col-foreground)", fontWeight: 800 }}>= ${total.toFixed(2)}</span>
                        </div>
                    )}
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <Button type="button" variant="glass" className="btn-full" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" className="btn-full" disabled={submitting || days < 1}>
                            {submitting ? "Booking…" : "Confirm"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Fleet Page ──────────────────────────────────────────────── */
const Fleet = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [selectedCar, setSelectedCar] = useState(null);

    const fetchCars = () => {
        setLoading(true);
        api.getCars()
            .then(data => setCars(Array.isArray(data) ? data : []))
            .catch(() => toast.error("Could not load fleet"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCars(); }, []);

    const brands = ["All", ...new Set(cars.map(c => c.brand).filter(Boolean))];
    const filtered = cars.filter(c => {
        const q = search.toLowerCase();
        return (c.brand?.toLowerCase().includes(q) || c.model?.toLowerCase().includes(q))
            && (filter === "All" || c.brand === filter);
    });

    const handleRentClick = (car) => {
        if (!user) { navigate("/login"); return; }
        setSelectedCar(car);
    };

    return (
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1.5rem" }}>
            {/* Header */}
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "var(--col-foreground)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                    Our Premium <span style={{ color: "var(--col-primary)" }}>Fleet</span>
                </h1>
                <p style={{ color: "var(--col-muted)", marginTop: "0.75rem", maxWidth: "36rem" }}>
                    Choose from our curated collection of world-class vehicles. From sports cars to luxury SUVs.
                </p>
            </div>

            {/* Toolbar */}
            <div style={{
                display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem",
                padding: "1.25rem", background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)", borderRadius: "1.25rem", marginBottom: "2rem",
            }}>
                {/* Search */}
                <div style={{ position: "relative", flex: "1 1 200px", minWidth: "180px" }}>
                    <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                    <input
                        style={{
                            ...inputStyle, paddingLeft: "2.25rem",
                        }}
                        placeholder="Search make or model…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Brand filters */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {brands.map(b => (
                        <button key={b} onClick={() => setFilter(b)} style={{
                            padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
                            border: "1px solid",
                            borderColor: filter === b ? "transparent" : "rgba(0,0,0,0.08)",
                            background: filter === b ? "var(--col-primary)" : "rgba(0,0,0,0.03)",
                            color: filter === b ? "#fff" : "var(--col-muted)",
                            cursor: "pointer", transition: "all 0.2s",
                        }}>{b}</button>
                    ))}
                </div>

                <span style={{ color: "#64748b", fontSize: "0.8rem", marginLeft: "auto" }}>
                    {filtered.length} vehicles
                </span>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "1.25rem", height: "22rem" }} className="skeleton" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#64748b" }}>
                    <Filter size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
                    <h3 style={{ color: "var(--col-foreground)", marginBottom: "0.5rem" }}>No cars found</h3>
                    <Button variant="primary" onClick={() => { setSearch(""); setFilter("All"); }}>Clear Filters</Button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    <AnimatePresence>
                        {filtered.map((car, i) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: i * 0.03 }}
                                whileHover={{ y: -6 }}
                                style={{
                                    background: "rgba(0,0,0,0.02)",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    borderRadius: "1.25rem",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "border-color 0.2s",
                                }}
                            >
                                {/* Image */}
                                <div style={{ position: "relative", height: "10.5rem", overflow: "hidden", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {car.imageUrl ? (
                                        <img
                                            src={car.imageUrl}
                                            alt={`${car.brand} ${car.model}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;color:#475569;gap:0.5rem"><div style="background:rgba(255,255,255,0.05);padding:12px;borderRadius:50%"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 20 20M10.41 10.41a2 2 0 1 0 2.83 2.83M8 21h12a2 2 0 0 0 1.82-2.82M8 21a2 2 0 0 1-2-2 2 2 0 0 1 .18-.82M21 16V5a2 2 0 0 0-2-2H9"/><path d="m14 14 3-3 3 3m-3-3v12"/><path d="M3 21h.01"/><path d="M3 7V5a2 2 0 0 1 2-2"/></svg></div><span style="font-size:0.75rem;font-weight:500 uppercase tracking-wider">No Photo</span></div>'; }}
                                        />
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#475569", gap: "0.5rem" }}>
                                            <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "50%" }}>
                                                <ImageOff size={24} />
                                            </div>
                                            <span style={{ fontSize: "0.75rem", fontWeight: 500, uppercase: "true", tracking: "wider" }}>No Photo</span>
                                        </div>
                                    )}
                                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                                        <Badge variant={car.isAvailable ? "success" : "danger"}>
                                            {car.isAvailable ? "Available" : "Booked"}
                                        </Badge>
                                    </div>
                                    {car.averageRating > 0 && (
                                        <div style={{
                                            position: "absolute", bottom: "0.75rem", right: "0.75rem",
                                            background: "rgba(10,25,47,0.82)", backdropFilter: "blur(8px)",
                                            padding: "2px 10px", borderRadius: "99px",
                                            display: "flex", alignItems: "center", gap: "4px",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                        }}>
                                            <span style={{ color: "#fbbf24", fontSize: "0.7rem" }}>★</span>
                                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>{car.averageRating.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <h3 style={{ fontWeight: 700, color: "var(--col-foreground)", fontSize: "1rem" }}>{car.brand} {car.model}</h3>
                                            <p style={{ fontSize: "0.75rem", color: "var(--col-muted)" }}>Luxury Vehicle</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <span style={{ fontWeight: 800, color: "var(--col-foreground)" }}>${car.pricePerDay}</span>
                                            <span style={{ fontSize: "0.7rem", color: "var(--col-muted)", display: "block" }}>/day</span>
                                        </div>
                                    </div>

                                    {/* Specs Grid */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", margin: "0.25rem 0" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--col-muted)" }}>
                                            <Fuel size={14} />
                                            <span style={{ fontSize: "0.75rem" }}>{car.fuelType || "Petrol"}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--col-muted)" }}>
                                            <Gauge size={14} />
                                            <span style={{ fontSize: "0.75rem" }}>{car.transmission || "Auto"}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--col-muted)" }}>
                                            <Users size={14} />
                                            <span style={{ fontSize: "0.75rem" }}>{car.seatingCapacity || 5} Seats</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--col-muted)" }}>
                                            <Calendar size={14} />
                                            <span style={{ fontSize: "0.75rem" }}>{car.year || 2024}</span>
                                        </div>
                                    </div>

                                    {car.description && (
                                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                                            {car.description}
                                        </p>
                                    )}

                                    <Button
                                        variant={car.isAvailable ? "primary" : "glass"}
                                        className="btn-full"
                                        disabled={!car.isAvailable}
                                        onClick={() => {
                                            if (!car.isAvailable) return;
                                            if (!user) {
                                                navigate("/login");
                                                return;
                                            }
                                            setSelectedCar(car);
                                        }}
                                        style={{ marginTop: "auto" }}
                                    >
                                        {!car.isAvailable ? "Not Available" : !user ? "Login to Rent" : "Rent Now"}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {selectedCar && (
                <FleetBookingModal
                    car={selectedCar}
                    user={user}
                    onClose={() => setSelectedCar(null)}
                    onBooked={fetchCars}
                />
            )}
        </div>
    );
};

export default Fleet;
