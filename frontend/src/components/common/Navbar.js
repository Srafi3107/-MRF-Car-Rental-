import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Car, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => { logout(); navigate("/login"); };

    const handleDashboardClick = () => {
        if (!user) {
            toast.warning("Please log in first", { description: "Sign in or create an account to access your dashboard." });
            return;
        }
        navigate(user.role?.toLowerCase() === "admin" ? "/admin" : "/dashboard");
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Fleet", path: "/fleet" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
        { name: "UML", path: "/uml" },
    ];

    const navStyle = {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "1rem 2rem",
        backgroundColor: isScrolled ? "rgba(10,25,47,0.88)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s ease",
    };

    const linkStyle = (active) => ({
        fontSize: "0.875rem",
        fontWeight: 500,
        color: active ? "var(--col-primary)" : "#cbd5e1",
        textDecoration: "none",
        transition: "color 0.2s",
    });

    const dashboardActive = location.pathname.startsWith("/admin") || location.pathname.startsWith("/dashboard");

    return (
        <nav style={navStyle}>
            <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {/* Logo */}
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                    <div style={{ background: "var(--col-primary)", padding: "8px", borderRadius: "10px", display: "flex" }}>
                        <Car style={{ color: "#fff", width: 22, height: 22 }} />
                    </div>
                    <span style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.025em", color: "#fff" }}>
                        MRF<span style={{ color: "var(--col-primary)" }}>RENTAL</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} style={linkStyle(location.pathname === link.path)}>
                            {link.name}
                        </Link>
                    ))}
                    {/* Dashboard — always visible, auth-gated with toast */}
                    <button onClick={handleDashboardClick} style={{
                        ...linkStyle(dashboardActive),
                        background: "none", border: "none", cursor: "pointer", padding: 0,
                        display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "inherit",
                    }}>
                        <LayoutDashboard size={15} /> Dashboard
                    </button>
                </div>

                {/* Auth Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="hidden md:flex">
                    {user ? (
                        <>
                            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                Hi, <span style={{ color: "#fff", fontWeight: 600 }}>{user.name || user.username}</span>
                            </span>
                            <Button variant="glass" size="sm" onClick={handleLogout} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                                <LogOut size={16} /> Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
                            <Button variant="primary" size="sm" onClick={() => navigate("/register")}>Get Started</Button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ color: "#fff", background: "none", border: "none", cursor: "pointer", padding: "4px", display: "none" }}
                    className="mobile-toggle"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0,
                    background: "rgba(10,25,47,0.97)",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    padding: "1.5rem 2rem",
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{
                                    fontSize: "1.05rem", fontWeight: 500, padding: "0.75rem 0",
                                    color: location.pathname === link.path ? "var(--col-primary)" : "#e2e8f0",
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                                    textDecoration: "none",
                                }}
                            >
                                {link.name} <ChevronRight size={16} style={{ opacity: 0.5 }} />
                            </Link>
                        ))}
                        {/* Dashboard */}
                        <button
                            onClick={() => { handleDashboardClick(); setIsMobileMenuOpen(false); }}
                            style={{
                                fontSize: "1.05rem", fontWeight: 500, padding: "0.75rem 0",
                                color: dashboardActive ? "var(--col-primary)" : "#e2e8f0",
                                background: "none", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                                fontFamily: "inherit", textAlign: "left", width: "100%",
                            }}
                        >
                            Dashboard <ChevronRight size={16} style={{ opacity: 0.5 }} />
                        </button>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                            {user ? (
                                <Button variant="glass" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                                    <LogOut size={16} /> Logout
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}>Sign In</Button>
                                    <Button variant="primary" onClick={() => { navigate("/register"); setIsMobileMenuOpen(false); }}>Get Started</Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
