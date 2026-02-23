import React from "react";
import { motion } from "framer-motion";
import { Star, Fuel, Users, Gauge, ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { Badge } from "./Badge";

const carCardStyle = {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "1.25rem",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    height: "100%",
    transition: "border-color 0.2s, background 0.2s",
};

const specStyle = {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "8px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    border: "1px solid rgba(255,255,255,0.05)",
};

const CarCard = ({ car, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            style={{ height: "100%" }}
        >
            <div style={carCardStyle}>
                {/* Image */}
                <div style={{ position: "relative", height: "11rem", overflow: "hidden", borderRadius: "1rem 1rem 0 0" }}>
                    <img
                        src={car.imageUrl || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000"}
                        alt={`${car.brand} ${car.model}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                        className="car-img-zoom"
                    />
                    {/* Availability Badge */}
                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                        <Badge variant={car.isAvailable ? "success" : "danger"}>
                            {car.isAvailable ? "Available" : "Booked"}
                        </Badge>
                    </div>
                    {/* Rating */}
                    <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem" }}>
                        <div style={{
                            background: "rgba(10,25,47,0.82)",
                            backdropFilter: "blur(10px)",
                            padding: "2px 10px",
                            borderRadius: "99px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}>
                            <Star size={12} style={{ color: "#fbbf24", fill: "#fbbf24" }} />
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
                                {car.averageRating?.toFixed(1) || "5.0"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>
                                {car.brand} {car.model}
                            </h3>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Premium Luxury</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>${car.pricePerDay}</span>
                            <span style={{ fontSize: "0.7rem", color: "#94a3b8", display: "block" }}>/ day</span>
                        </div>
                    </div>

                    {/* Specs */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "1.25rem" }}>
                        {[
                            { Icon: Users, label: "4 Seats" },
                            { Icon: Fuel, label: "Hybrid" },
                            { Icon: Gauge, label: "Auto" },
                        ].map(({ Icon, label }) => (
                            <div key={label} style={specStyle}>
                                <Icon size={14} style={{ color: "var(--col-primary)" }} />
                                <span style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 500 }}>{label}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "auto" }}>
                        <Button variant="glass" className="btn-full" onClick={() => onClick(car)}>
                            Rent Now <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CarCard;
