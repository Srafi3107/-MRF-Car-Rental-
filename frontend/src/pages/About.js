import React from "react";
import { motion } from "framer-motion";
import { Users, Car, MapPin, Award } from "lucide-react";

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
            {/* Story */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Redefining the <span className="text-gradient">Rental Experience</span> Since 2024
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        MRF Rental started with a simple vision: to make luxury car rentals accessible, transparent, and seamless. We believe that the journey should be just as extraordinary as the destination.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        Over the past few years, we've grown from a local fleet to a premier destination for automotive enthusiasts and travelers seeking excellence in every mile.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <img
                        src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2070"
                        alt="About Us"
                        className="relative z-10 rounded-3xl shadow-2xl border border-white/10"
                    />
                </motion.div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { icon: <Car />, val: "200+", label: "Premium Cars" },
                    { icon: <Users />, val: "15k+", label: "Happy Clients" },
                    { icon: <MapPin />, val: "12", label: "Locations" },
                    { icon: <Award />, val: "50+", label: "Industry Awards" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card text-center p-8 border-white/5">
                        <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                        <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Mission */}
            <section className="text-center max-w-3xl mx-auto space-y-6">
                <h2 className="text-4xl font-bold text-white">Our Mission</h2>
                <p className="text-lg text-slate-400 leading-relaxed italic">
                    "To provide unparalleled freedom of movement through a world-class fleet and a customer-first digital experience, where luxury meets convenience at every touchpoint."
                </p>
            </section>
        </div>
    );
};

export default About;
