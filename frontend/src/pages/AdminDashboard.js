import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import { api, uploadCarImage } from "../api/api";
import {
    LayoutDashboard, Car, Users, CalendarCheck, TrendingUp,
    Plus, Search, X, Edit, Trash2, Check, XCircle, DollarSign, Upload, ImageIcon, ImageOff, ShieldAlert
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { toast } from "sonner";

/* ─── Shared Styles ─────────────────────────────────────────────── */
const card = {
    background: "rgba(0,0,0,0.02)",
    border: "1px solid rgba(0,0,0,0.05)",
    borderRadius: "1.25rem",
    overflow: "hidden",
};

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
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "var(--col-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "0.35rem",
    display: "block",
};

const thStyle = {
    padding: "0.875rem 1.25rem",
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "var(--col-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    textAlign: "left",
    background: "rgba(0,0,0,0.02)",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
};

const tdStyle = {
    padding: "0.875rem 1.25rem",
    borderBottom: "1px solid rgba(0,0,0,0.02)",
    fontSize: "0.875rem",
    color: "var(--col-foreground)",
};

/* ─── Vehicle Modal ─────────────────────────────────────────────── */
const VehicleModal = ({ car, onClose, onSaved }) => {
    const isEdit = !!car?.id;
    const fileRef = useRef();
    const [form, setForm] = useState({
        brand: car?.brand || "",
        model: car?.model || "",
        pricePerDay: car?.pricePerDay || "",
        description: car?.description || "",
        image: car?.image || "",
        id: car?.id || undefined,
        isAvailable: car?.isAvailable ?? true,
    });
    const [previewUrl, setPreviewUrl] = useState(car?.imageUrl || "");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Local preview immediately
        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);
        try {
            const result = await uploadCarImage(file);
            setForm(prev => ({ ...prev, image: result.filename }));
            toast.success("Image uploaded!");
        } catch {
            toast.error("Image upload failed — check the backend is running");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                pricePerDay: parseFloat(form.pricePerDay),
                isAvailable: form.isAvailable
            };
            if (isEdit) {
                await api.updateCar(payload);
                toast.success("Vehicle updated!");
            } else {
                await api.addCar(payload);
                toast.success("Vehicle added to fleet!");
            }
            onSaved();
            onClose();
        } catch (err) {
            toast.error(isEdit ? "Failed to update vehicle" : "Failed to add vehicle");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }} onClick={onClose}>
            <div style={{
                background: "var(--col-bg)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "1.5rem",
                padding: "2rem",
                width: "100%",
                maxWidth: "32rem",
                maxHeight: "90vh",
                overflowY: "auto",
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--col-foreground)" }}>
                        {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose}><X size={20} /></Button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Image Upload */}
                    <div>
                        <label style={labelStyle}>Vehicle Photo</label>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{
                                border: "2px dashed rgba(255,255,255,0.12)",
                                borderRadius: "12px",
                                padding: previewUrl ? "0" : "2rem",
                                textAlign: "center",
                                cursor: "pointer",
                                overflow: "hidden",
                                position: "relative",
                                transition: "border-color 0.2s",
                                minHeight: previewUrl ? "10rem" : "auto",
                            }}
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="preview" style={{ width: "100%", height: "10rem", objectFit: "cover" }} />
                                    <div style={{
                                        position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        opacity: 0, transition: "opacity 0.2s",
                                    }} className="img-hover-overlay">
                                        <span style={{ color: "#fff", fontSize: "0.8rem", fontWeight: 600 }}>Click to change</span>
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: "#64748b" }}>
                                    {uploading ? (
                                        <span style={{ fontSize: "0.875rem" }}>Uploading…</span>
                                    ) : (
                                        <>
                                            <Upload size={28} />
                                            <span style={{ fontSize: "0.875rem" }}>Click to upload photo</span>
                                            <span style={{ fontSize: "0.7rem" }}>JPG, PNG, WEBP supported</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {uploading && <p style={{ fontSize: "0.75rem", color: "var(--col-primary)", marginTop: "0.35rem" }}>Uploading image…</p>}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div>
                            <label style={labelStyle}>Brand *</label>
                            <input name="brand" style={inputStyle} placeholder="Toyota" value={form.brand} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Model *</label>
                            <input name="model" style={inputStyle} placeholder="Camry" value={form.model} onChange={handleChange} required />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Price Per Day (USD) *</label>
                        <input name="pricePerDay" type="number" min="1" step="0.01" style={inputStyle}
                            placeholder="99.00" value={form.pricePerDay} onChange={handleChange} required />
                    </div>

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea name="description" style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                            placeholder="Brief description of the vehicle..." value={form.description} onChange={handleChange} />
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <Button type="button" variant="glass" className="btn-full" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="primary" className="btn-full" disabled={saving}>
                            {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Vehicle"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ─── Main AdminDashboard ────────────────────────────────────────── */
const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { name: "Overview", path: "/admin", icon: <LayoutDashboard size={16} /> },
        { name: "Fleet", path: "/admin/cars", icon: <Car size={16} /> },
        { name: "Bookings", path: "/admin/bookings", icon: <CalendarCheck size={16} /> },
        { name: "Customers", path: "/admin/customers", icon: <Users size={16} /> },
        { name: "Security", path: "/admin/security", icon: <ShieldAlert size={16} /> },
    ];

    const isActive = (p) => location.pathname === p;

    return (
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
            {/* Header */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", marginBottom: "2.5rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--col-foreground)", letterSpacing: "-0.025em" }}>Admin Console</h1>
                    <p style={{ color: "var(--col-muted)", marginTop: "0.25rem" }}>Manage your fleet and track performance</p>
                </div>
                {/* Tab bar */}
                <div style={{ display: "flex", background: "rgba(0,0,0,0.03)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", gap: "4px", overflowX: "auto" }}>
                    {tabs.map(tab => (
                        <button key={tab.path} onClick={() => navigate(tab.path)} style={{
                            display: "flex", alignItems: "center", gap: "0.4rem",
                            padding: "0.5rem 1.1rem", borderRadius: "9px",
                            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                            whiteSpace: "nowrap",
                            border: "none",
                            background: isActive(tab.path) ? "var(--col-primary)" : "transparent",
                            color: isActive(tab.path) ? "#fff" : "var(--col-muted)",
                            transition: "all 0.2s",
                        }}>
                            {tab.icon} {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/cars" element={<CarManager />} />
                <Route path="/bookings" element={<BookingList />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/security" element={<SecurityPanel />} />
            </Routes>
        </div>
    );
};

/* ─── Dashboard Overview ─────────────────────────────────────────── */
const DashboardOverview = () => {
    const [stats, setStats] = useState({ users: 0, cars: 0, bookings: 0, earnings: 0 });
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.getUsers(), api.getCars(), api.getBookings()])
            .then(([users, cars, bookings]) => {
                setStats({
                    users: users.length,
                    cars: cars.length,
                    bookings: bookings.length,
                    earnings: bookings.reduce((a, b) => a + (b.status !== "CANCELLED" ? (b.totalPrice || 0) : 0), 0),
                });
                setRecent(bookings.slice(-5).reverse());
            })
            .catch(() => toast.error("Failed to load dashboard"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading dashboard…</p>;

    const statCards = [
        { title: "Total Revenue", value: `$${stats.earnings.toLocaleString()}`, icon: <DollarSign size={22} />, color: "var(--col-primary)" },
        { title: "Active Bookings", value: stats.bookings, icon: <CalendarCheck size={22} />, color: "#10b981" },
        { title: "Fleet Size", value: stats.cars, icon: <Car size={22} />, color: "#f59e0b" },
        { title: "Total Customers", value: stats.users, icon: <Users size={22} />, color: "#6366f1" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem" }}>
                {statCards.map((s, i) => (
                    <div key={i} style={{ ...card, padding: "1.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <div style={{ padding: "0.65rem", background: s.color + "22", borderRadius: "10px", color: s.color }}>
                                {s.icon}
                            </div>
                            <TrendingUp size={14} style={{ color: "#10b981" }} />
                        </div>
                        <p style={{ fontSize: "0.75rem", color: "var(--col-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.title}</p>
                        <p style={{ fontSize: "1.875rem", fontWeight: 800, color: "var(--col-foreground)", marginTop: "0.25rem" }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div style={card}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontWeight: 700, color: "var(--col-foreground)" }}>Recent Reservations</h3>
                    <Link to="/admin/bookings" style={{ fontSize: "0.8rem", color: "var(--col-primary)", fontWeight: 600 }}>View All →</Link>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["ID", "Customer", "Status", "Total"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {recent.length === 0 && (
                            <tr><td colSpan="4" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "3rem" }}>No bookings yet</td></tr>
                        )}
                        {recent.map(b => (
                            <tr key={b.id} style={{ transition: "background 0.15s" }}>
                                <td style={tdStyle}><span style={{ color: "var(--col-muted)", fontFamily: "monospace" }}>#{b.id?.slice(-6)}</span></td>
                                <td style={{ ...tdStyle, color: "var(--col-foreground)", fontWeight: 600 }}>{b.customerName || b.userId || "—"}</td>
                                <td style={tdStyle}>
                                    <Badge variant={b.status === "COMPLETED" ? "success" : b.status === "CANCELLED" ? "danger" : b.status === "APPROVED" ? "default" : "warning"}>
                                        {b.status}
                                    </Badge>
                                </td>
                                <td style={{ ...tdStyle, color: "var(--col-foreground)", fontWeight: 700 }}>${b.totalPrice ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ─── Car Manager ────────────────────────────────────────────────── */
const CarManager = () => {
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // null | "add" | carObject(edit)

    const load = async () => {
        setLoading(true);
        try { setCars(await api.getCars(search)); }
        catch { toast.error("Failed to load fleet"); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        const t = setTimeout(load, 300);
        return () => clearTimeout(t);
    }, [search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this vehicle from the fleet?")) return;
        try {
            await api.deleteCar(id);
            toast.success("Vehicle removed");
            setCars(cars.filter(c => c.id !== id));
        } catch { toast.error("Failed to delete vehicle"); }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Toolbar */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "360px" }}>
                    <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                    <input
                        style={{ ...inputStyle, paddingLeft: "2.25rem" }}
                        placeholder="Search fleet by brand or model…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="primary" onClick={() => setModal("add")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Plus size={18} /> Add Vehicle
                </Button>
            </div>

            {loading && <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading fleet…</p>}

            {/* Cars Table */}
            {!loading && (
                <div style={card}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                {["Vehicle", "Price/Day", "Status", "Rating", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {cars.length === 0 && (
                                <tr><td colSpan="5" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "3rem" }}>No vehicles found</td></tr>
                            )}
                            {cars.map(c => (
                                <tr key={c.id}>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                            <div style={{ width: 56, height: 40, background: "rgba(255,255,255,0.03)", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                {c.imageUrl ? (
                                                    <img
                                                        src={c.imageUrl}
                                                        alt={c.model}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 2 20 20M10.41 10.41a2 2 0 1 0 2.83 2.83M8 21h12a2 2 0 0 0 1.82-2.82M8 21a2 2 0 0 1-2-2 2 2 0 0 1 .18-.82M21 16V5a2 2 0 0 0-2-2H9"/><path d="m14 14 3-3 3 3m-3-3v12"/><path d="M3 21h.01"/><path d="M3 7V5a2 2 0 0 1 2-2"/></svg>'; }}
                                                    />
                                                ) : (
                                                    <ImageOff size={18} style={{ color: "#475569" }} />
                                                )}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: "var(--col-foreground)" }}>{c.brand} {c.model}</div>
                                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>ID: {c.id?.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 700, color: "var(--col-foreground)" }}>${c.pricePerDay}</td>
                                    <td style={tdStyle}>
                                        <Badge variant={c.isAvailable ? "success" : "danger"}>
                                            {c.isAvailable ? "Available" : "Rented"}
                                        </Badge>
                                    </td>
                                    <td style={{ ...tdStyle, color: "#fbbf24", fontWeight: 700 }}>
                                        ★ {c.averageRating > 0 ? c.averageRating.toFixed(1) : "—"}
                                    </td>
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <Button variant="outline" size="sm" onClick={() => setModal(c)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Edit size={14} /> Edit
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modal && (
                <VehicleModal
                    car={modal === "add" ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={load}
                />
            )}
        </div>
    );
};

/* ─── Booking List ────────────────────────────────────────────────── */
const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try { setBookings(await api.getBookings()); }
        catch { toast.error("Failed to load bookings"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const approve = async (id) => {
        try { await api.approveBooking(id); toast.success("Booking approved"); load(); }
        catch { toast.error("Approval failed"); }
    };

    const cancel = async (id) => {
        if (!window.confirm("Cancel this booking?")) return;
        try { await api.cancelBooking(id); toast.success("Booking cancelled"); load(); }
        catch { toast.error("Cancellation failed"); }
    };

    if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading bookings…</p>;

    return (
        <div style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>{["Booking", "Customer", "Car", "Total", "Status", "Actions"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {bookings.length === 0 && (
                        <tr><td colSpan="6" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "3rem" }}>No bookings found</td></tr>
                    )}
                    {bookings.map(b => (
                        <tr key={b.id}>
                            <td style={tdStyle}><span style={{ fontFamily: "monospace", color: "var(--col-muted)" }}>#{b.id?.slice(-6)}</span></td>
                            <td style={{ ...tdStyle, color: "var(--col-foreground)", fontWeight: 600 }}>{b.customerName || b.userId || "—"}</td>
                            <td style={{ ...tdStyle, color: "#cbd5e1" }}>{b.carId}</td>
                            <td style={{ ...tdStyle, fontWeight: 700, color: "var(--col-foreground)" }}>${b.totalPrice}</td>
                            <td style={tdStyle}>
                                <Badge variant={b.status === "COMPLETED" ? "success" : b.status === "CANCELLED" ? "danger" : b.status === "APPROVED" ? "default" : "warning"}>
                                    {b.status}
                                </Badge>
                            </td>
                            <td style={tdStyle}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {b.status === "PENDING" && (
                                        <>
                                            <Button size="sm" onClick={() => approve(b.id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Check size={14} /> Approve
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => cancel(b.id)}>Cancel</Button>
                                        </>
                                    )}
                                    {b.status === "APPROVED" && (
                                        <Button variant="danger" size="sm" onClick={() => cancel(b.id)} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <XCircle size={14} /> Cancel
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* ─── Customer List ───────────────────────────────────────────────── */
const CustomerList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try { setUsers(await api.getUsers()); }
        catch { toast.error("Failed to load customers"); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const del = async (id) => {
        if (!window.confirm("Delete this customer account?")) return;
        try { await api.deleteUser(id); toast.success("Customer removed"); load(); }
        catch { toast.error("Failed to delete customer"); }
    };

    if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading customers…</p>;

    return (
        <div style={card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>{["Customer", "Contact", "Username", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr><td colSpan="4" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "3rem" }}>No customers found</td></tr>
                    )}
                    {users.map(u => (
                        <tr key={u.id}>
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 700, color: "var(--col-foreground)" }}>{u.name || "—"}</div>
                                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>#{u.id?.slice(-6)}</div>
                            </td>
                            <td style={tdStyle}>
                                <div style={{ color: "#cbd5e1" }}>{u.email || "—"}</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.phone || "—"}</div>
                            </td>
                            <td style={{ ...tdStyle, color: "var(--col-muted)" }}>{u.username}</td>
                            <td style={tdStyle}>
                                <Button variant="danger" size="sm" onClick={() => del(u.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* ─── Security Panel ───────────────────────────────────────────────── */
const SecurityPanel = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const allUsers = await api.getUsers();
            const resetReqs = allUsers.filter(u => u.passwordResetRequested && !u.passwordResetApproved);
            setRequests(resetReqs);
        } catch {
            toast.error("Failed to load security requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const approve = async (userId) => {
        try {
            await api.approveReset(userId);
            toast.success("Password reset approved");
            load();
        } catch {
            toast.error("Approval failed");
        }
    };

    if (loading) return <p style={{ color: "#64748b", textAlign: "center", padding: "3rem" }}>Loading requests…</p>;

    return (
        <div style={card}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--col-foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldAlert size={18} color="#f59e0b" /> Password Reset Approvals
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: "0.25rem" }}>
                    Users listed below have requested a password reset. You must approve before they can set a new password.
                </p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>{["User", "Contact", "Requested At", "Action"].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {requests.length === 0 && (
                        <tr><td colSpan="4" style={{ ...tdStyle, textAlign: "center", color: "#64748b", padding: "3rem" }}>No pending requests</td></tr>
                    )}
                    {requests.map(u => (
                        <tr key={u.id}>
                            <td style={tdStyle}>
                                <div style={{ fontWeight: 700, color: "var(--col-foreground)" }}>{u.username}</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.name || "Customer"}</div>
                            </td>
                            <td style={tdStyle}>
                                <div style={{ color: "#cbd5e1" }}>{u.email}</div>
                            </td>
                            <td style={{ ...tdStyle, color: "var(--col-muted)" }}>Pending Approval</td>
                            <td style={tdStyle}>
                                <Button size="sm" variant="primary" onClick={() => approve(u.id)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Check size={14} /> Approve Reset
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
