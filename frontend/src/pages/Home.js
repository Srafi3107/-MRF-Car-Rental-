import React from "react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { Star, Shield, Headphones, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Home = () => {
    const navigate = useNavigate();

    const features = [
        { icon: <Shield size={36} />, title: "Secure Payments", desc: "Bank-grade encryption protects every transaction" },
        { icon: <Star size={36} />, title: "5-Star Service", desc: "Voted best rental service 2025 by our customers" },
        { icon: <Headphones size={36} />, title: "24/7 Support", desc: "Our team is always here when you need us" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem", paddingBottom: "5rem" }}>

            {/* ── Hero Section ────────────────────────────────── */}
            <section style={{
                position: "relative",
                minHeight: "88vh",
                display: "flex",
                alignItems: "center",
                padding: "2rem 2rem",
                overflow: "hidden",
            }}>
                {/* Background Image */}
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 1,
                        background: "linear-gradient(to right, rgba(10,25,47,0.97) 0%, rgba(10,25,47,0.7) 50%, rgba(10,25,47,0.2) 100%)",
                    }} />
                    <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
                        alt="Hero Car"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        className="animate-slow-zoom"
                    />
                </div>

                {/* Hero Content */}
                <div style={{ position: "relative", zIndex: 2, maxWidth: "80rem", margin: "0 auto", width: "100%" }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ maxWidth: "38rem" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                                background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)",
                                borderRadius: "999px", padding: "0.35rem 1rem", marginBottom: "1.5rem",
                                fontSize: "0.8rem", fontWeight: 600, color: "var(--col-primary)",
                            }}
                        >
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--col-primary)", display: "inline-block" }} />
                            Premium Fleet Available Now
                        </motion.div>

                        <h1 style={{
                            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                            fontWeight: 800,
                            color: "#fff",
                            lineHeight: 1.1,
                            marginBottom: "1.5rem",
                        }}>
                            Drive the <span style={{ color: "var(--col-primary)" }}>Future</span> of Luxury
                        </h1>

                        <p style={{
                            fontSize: "1.1rem", color: "#cbd5e1", lineHeight: 1.7,
                            marginBottom: "2.5rem", maxWidth: "32rem",
                        }}>
                            Unlock extraordinary experiences with our curated collection of premium vehicles. Simple booking, unparalleled service.
                        </p>

                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <Button size="lg" onClick={() => navigate("/fleet")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                Explore Fleet <ArrowRight size={18} />
                            </Button>
                            <Button size="lg" variant="glass" onClick={() => navigate("/about")}>
                                Learn More
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Trust Indicators ────────────────────────────── */}
            <section style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 2rem", width: "100%" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "2rem",
                }}>
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                padding: "2.5rem 1.5rem",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "1.25rem",
                                gap: "1rem",
                            }}
                        >
                            <div style={{
                                padding: "1rem",
                                background: "rgba(59,130,246,0.15)",
                                borderRadius: "1rem",
                                color: "var(--col-primary)",
                                display: "flex",
                            }}>
                                {item.icon}
                            </div>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>{item.title}</h3>
                            <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ──────────────────────────────────── */}
            <section style={{ padding: "0 2rem" }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        maxWidth: "80rem", margin: "0 auto",
                        background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.12) 100%)",
                        border: "1px solid rgba(59,130,246,0.25)",
                        borderRadius: "1.5rem",
                        padding: "3.5rem 2.5rem",
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "2rem",
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff", marginBottom: "0.5rem" }}>
                            Ready to hit the road?
                        </h2>
                        <p style={{ color: "#94a3b8" }}>Browse our full fleet and book your dream car today.</p>
                    </div>
                    <Button size="lg" onClick={() => navigate("/register")} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        Get Started Free <ArrowRight size={18} />
                    </Button>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
