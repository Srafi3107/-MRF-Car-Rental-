import React, { useState } from "react";
import { api } from "../api/api";
import { KeyRound, Mail, User as UserIcon, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const inputStyle = {
    width: "100%",
    background: "rgba(0,0,0,0.03)",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "12px",
    padding: "0.8rem 1rem",
    paddingLeft: "2.75rem",
    color: "var(--col-foreground)",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
};

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1: Request, 2: Status Check/Reset
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState(null); // { status: 'PENDING' | 'APPROVED' | 'NONE' }

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.forgotPassword(form.username, form.email);
            toast.success(res.message);
            setStep(2);
            checkStatus();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        if (!form.username) return;
        setLoading(true);
        try {
            const res = await api.getResetStatus(form.username);
            setStatusData(res);
            if (res.status === 'APPROVED') {
                toast.success("Admin has approved your request!");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (!form.password) return toast.error("Please enter a new password");
        setLoading(true);
        try {
            const res = await api.finalizeReset(form.username, form.password);
            toast.success(res.message);
            setStep(3); // Success Screen
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--col-bg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            color: "var(--col-foreground)"
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    background: "rgba(0,0,0,0.02)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "24px",
                    padding: "2.5rem",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)"
                }}
            >
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                        width: "60px",
                        height: "60px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        borderRadius: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 1.25rem",
                        boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)"
                    }}>
                        <KeyRound size={30} color="white" />
                    </div>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
                        {step === 1 ? "Forgot Password?" : step === 2 ? "Reset Status" : "Success!"}
                    </h1>
                    <p style={{ color: "var(--col-muted)", fontSize: "0.95rem" }}>
                        {step === 1 ? "Enter your details to request an Admin approval." :
                            step === 2 ? "Check if your request has been approved." :
                                "Your password has been reset successfully."}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleRequest}
                            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                        >
                            <div style={{ position: "relative" }}>
                                <UserIcon size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                                <input
                                    required
                                    placeholder="Username"
                                    style={inputStyle}
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                />
                            </div>
                            <div style={{ position: "relative" }}>
                                <Mail size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                                <input
                                    required
                                    type="email"
                                    placeholder="Registered Email"
                                    style={inputStyle}
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                            <Button disabled={loading} type="submit" style={{ height: "3.25rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 600 }}>
                                {loading ? "Submitting..." : "Request Approval"}
                            </Button>
                            <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                                <button type="button" onClick={() => setStep(2)} style={{ color: "#10b981", background: "none", border: "none", fontSize: "0.875rem", cursor: "pointer", fontWeight: 500 }}>
                                    Already requested? Check status
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                        >
                            {/* Status Card */}
                            <div style={{
                                background: "rgba(0,0,0,0.02)",
                                border: "1px solid rgba(0,0,0,0.05)",
                                borderRadius: "16px",
                                padding: "1.25rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem"
                            }}>
                                {(!statusData || statusData.status === 'PENDING') && (
                                    <>
                                        <div style={{ background: "rgba(245,158,11,0.1)", padding: "10px", borderRadius: "12px" }}>
                                            <Clock size={20} color="#f59e0b" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--col-foreground)" }}>Status: Pending Approval</div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Please ask your Admin to approve.</div>
                                        </div>
                                    </>
                                )}
                                {statusData?.status === 'APPROVED' && (
                                    <>
                                        <div style={{ background: "rgba(16,185,129,0.1)", padding: "10px", borderRadius: "12px" }}>
                                            <ShieldCheck size={20} color="#10b981" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--col-foreground)" }}>Status: Approved</div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>You can now set a new password.</div>
                                        </div>
                                    </>
                                )}
                                {statusData?.status === 'NONE' && (
                                    <>
                                        <div style={{ background: "rgba(239,68,68,0.1)", padding: "10px", borderRadius: "12px" }}>
                                            <AlertCircle size={20} color="#ef4444" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--col-foreground)" }}>No Request Found</div>
                                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Submit a request first.</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {!form.username && (
                                <div style={{ position: "relative" }}>
                                    <UserIcon size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                                    <input
                                        placeholder="Username"
                                        style={inputStyle}
                                        value={form.username}
                                        onChange={e => setForm({ ...form, username: e.target.value })}
                                        onBlur={checkStatus}
                                    />
                                </div>
                            )}

                            {statusData?.status === 'APPROVED' ? (
                                <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                    <div style={{ position: "relative" }}>
                                        <KeyRound size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
                                        <input
                                            required
                                            type="password"
                                            placeholder="New Password"
                                            style={inputStyle}
                                            value={form.password}
                                            onChange={e => setForm({ ...form, password: e.target.value })}
                                        />
                                    </div>
                                    <Button disabled={loading} type="submit" style={{ height: "3.25rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 600 }}>
                                        {loading ? "Updating..." : "Reset Password"}
                                    </Button>
                                </form>
                            ) : (
                                <Button onClick={checkStatus} disabled={loading} variant="outline" style={{ height: "3.25rem", borderRadius: "12px" }}>
                                    <Clock size={18} style={{ marginRight: "8px" }} />
                                    {loading ? "Checking..." : "Check Approval Status"}
                                </Button>
                            )}

                            <div style={{ textAlign: "center" }}>
                                <button type="button" onClick={() => setStep(1)} style={{ color: "#64748b", background: "none", border: "none", fontSize: "0.875rem", cursor: "pointer" }}>
                                    Back to request
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: "center" }}
                        >
                            <div style={{
                                width: "80px",
                                height: "80px",
                                background: "rgba(16,185,129,0.1)",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyCenter: "center",
                                margin: "0 auto 1.5rem"
                            }}>
                                <CheckCircle2 size={40} color="#10b981" />
                            </div>
                            <h2 style={{ marginBottom: "1.5rem" }}>Security Updated</h2>
                            <Link to="/login" style={{ textDecoration: "none" }}>
                                <Button style={{ width: "100%", height: "3.25rem" }}>
                                    Back to Login <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
