import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Shield, Save, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { GlassCard } from "../components/ui/GlassCard";

const Profile = () => {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        birthdate: user?.birthdate || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedUser = await api.updateProfile(user.id, formData);
            login(updatedUser);
            toast.success("Profile updated!", {
                description: "Your changes have been saved successfully.",
            });
        } catch (err) {
            toast.error("Update failed", {
                description: "We couldn't save your changes. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Account Settings</h1>
                <p className="text-slate-400">Manage your profile information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Card */}
                <GlassCard className="lg:col-span-1 p-8 text-center space-y-6 flex flex-col items-center border-white/5 h-fit">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                            <UserCircle size={64} />
                        </div>
                        <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-foreground rounded-full border-4 border-white shadow-xl">
                            <Shield size={12} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">{user?.name || user?.username}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user?.role || "Member"}</p>
                    </div>
                    <div className="w-full pt-6 border-t border-white/10 space-y-4 text-left">
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <User className="text-primary" size={16} />
                            <span>@{user?.username}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                            <Mail className="text-primary" size={16} />
                            <span className="truncate">{user?.email || "No email"}</span>
                        </div>
                    </div>
                </GlassCard>

                {/* Edit Form */}
                <GlassCard className="lg:col-span-2 p-8 border-white/5">
                    <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="name"
                                    className="pl-10"
                                    value={formData.name}
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
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="phone"
                                    className="pl-10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Birth Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                                <Input
                                    name="birthdate"
                                    type="date"
                                    className="pl-10"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 md:col-span-2">
                            <Button className="w-full gap-2" disabled={loading}>
                                {loading ? "Saving Changes..." : "Save Changes"}
                                <Save size={18} />
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
};

export default Profile;
