import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Car, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8080/auth/login", {
                username,
                password,
            });
            login(response.data);
            toast.success("Welcome back!", {
                description: `Logged in as ${response.data.username}`,
            });
            navigate(response.data.role === "ADMIN" ? "/admin" : "/dashboard");
        } catch (err) {
            toast.error("Login failed", {
                description: err.response?.data?.error || "Invalid username or password",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center px-8 md:px-24 py-12 bg-navy-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,#1e3a8a,transparent_40%)] opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full mx-auto space-y-10 relative z-10"
                >
                    <div className="space-y-2">
                        <Link to="/" className="flex items-center gap-2 mb-8 group w-fit">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                                <Car className="text-primary-foreground h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">
                                MRF<span className="text-primary">RENTAL</span>
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-400">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    className="pl-10 h-12"
                                    placeholder="yourname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center pl-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    type="password"
                                    className="pl-10 h-12"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button className="w-full h-12 gap-2 text-base shadow-xl shadow-primary/20" type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                            <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="text-center text-slate-400 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
                    </p>
                </motion.div>

                <div className="mt-auto pt-10 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                    <ShieldCheck size={14} />
                    Secure login with industry-standard encryption
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2070"
                    alt="Luxury Car"
                    className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
                />

                <div className="absolute inset-0 flex flex-col justify-end p-20 z-20">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card border-white/10 p-8 max-w-md"
                    >
                        <p className="text-white text-xl font-medium leading-relaxed italic mb-4">
                            "The best car rental experience I've ever had. Truly professional and premium service."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">JD</div>
                            <div>
                                <p className="text-white font-bold text-sm">John D.</p>
                                <p className="text-slate-400 text-xs">Verified Customer</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
