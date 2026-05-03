import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Lock, Phone, Calendar, ArrowRight, Car, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        phone: "",
        birthdate: "",
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/auth/register", formData);
            login(response.data);
            toast.success("Account created!", {
                description: "Welcome to MRF Rental family.",
            });
            navigate("/dashboard");
        } catch (err) {
            toast.error("Registration failed", {
                description: err.response?.data?.error || "Something went wrong. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2070"
                    alt="Luxury Fleet"
                    className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
                />

                <div className="absolute inset-0 flex flex-col justify-end p-20 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card border-white/10 p-8 max-w-md"
                    >
                        <h3 className="text-foreground text-2xl font-bold mb-4">Join the Elite</h3>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Register today to unlock exclusive rates, skip the queue, and access our premium world-wide fleet.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-navy-900 bg-slate-700 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <p className="text-foreground font-bold">15,000+ members</p>
                                <p className="text-slate-400">already joined us</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center px-8 md:px-24 py-12 bg-navy-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,#1e3a8a,transparent_40%)] opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto space-y-8 relative z-10"
                >
                    <div className="space-y-2 text-center lg:text-left">
                        <Link to="/" className="flex items-center gap-2 mb-8 group w-fit mx-auto lg:mx-0">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                <Car className="text-primary-foreground h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-foreground">
                                MRF<span className="text-primary">RENTAL</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">Create Account</h2>
                        <p className="text-slate-400">Join our premium car rental community</p>
                    </div>

                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="name"
                                    className="pl-10 h-11"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Username</label>
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="username"
                                    className="pl-10 h-11"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="password"
                                    type="password"
                                    className="pl-10 h-11"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="email"
                                    type="email"
                                    className="pl-10 h-11"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="phone"
                                    className="pl-10 h-11"
                                    placeholder="+1 234 567 89"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Birthdate</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="birthdate"
                                    type="date"
                                    className="pl-10 h-11"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="md:col-span-2 h-12 gap-2 text-base mt-4 shadow-xl shadow-primary/20" type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Create Account"}
                            <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="text-center text-slate-400 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-bold hover:underline">Sign in instead</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
