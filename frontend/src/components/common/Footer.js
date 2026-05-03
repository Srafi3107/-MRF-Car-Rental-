import React from "react";
import { Link } from "react-router-dom";
import { Car, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const linkStyle = {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "color 0.2s",
};

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: "var(--col-navy-900)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            padding: "4rem 2rem 2rem",
        }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
                {/* Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "3rem",
                    marginBottom: "3rem",
                }}>
                    {/* Brand */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                            <div style={{ background: "var(--col-primary)", padding: "8px", borderRadius: "10px" }}>
                                <Car style={{ color: "#fff", width: 22, height: 22 }} />
                            </div>
                            <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--col-foreground)" }}>
                                MRF<span style={{ color: "var(--col-primary)" }}>RENTAL</span>
                            </span>
                        </Link>
                        <p style={{ color: "#94a3b8", fontSize: "0.875rem", lineHeight: 1.6 }}>
                            Experience the future of car rentals. Premium fleet, seamless booking, and 24/7 world-class support.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    padding: "8px",
                                    background: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    color: "#94a3b8",
                                    display: "flex",
                                    transition: "all 0.2s",
                                }}>
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: "var(--col-foreground)", fontWeight: 600, marginBottom: "1.5rem" }}>Quick Links</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {[["Our Fleet", "/fleet"], ["About Us", "/about"], ["Contact", "/contact"]].map(([label, path]) => (
                                <li key={path}><Link to={path} style={linkStyle}>{label}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 style={{ color: "var(--col-foreground)", fontWeight: 600, marginBottom: "1.5rem" }}>Services</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {["Luxury Rentals", "Business Fleet", "Airport Transfer", "Chauffeur Service"].map(s => (
                                <li key={s}><a href="#" style={linkStyle}>{s}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: "var(--col-foreground)", fontWeight: 600, marginBottom: "1.5rem" }}>Contact Us</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            {[
                                { Icon: MapPin, text: "123 Luxury Drive, Beverly Hills, CA" },
                                { Icon: Phone, text: "+1 (555) 000-8888" },
                                { Icon: Mail, text: "support@mrfrental.com" },
                            ].map(({ Icon, text }) => (
                                <li key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.875rem" }}>
                                    <Icon size={16} style={{ color: "var(--col-primary)", flexShrink: 0 }} />
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    paddingTop: "2rem",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                }}>
                    <p style={{ color: "#64748b", fontSize: "0.75rem" }}>
                        © 2026 MRF Car Rental Management System. All rights reserved.
                    </p>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        {["Privacy Policy", "Terms of Service"].map(t => (
                            <a key={t} href="#" style={{ color: "#64748b", fontSize: "0.75rem", textDecoration: "none" }}>{t}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
