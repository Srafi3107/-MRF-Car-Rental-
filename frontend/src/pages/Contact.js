import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Info Side */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                            Get in <span className="text-gradient">Touch</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                            Have questions about our fleet or booking process? Our premium support team is here to assist you 24/7.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-6">
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="text-foreground font-bold mb-1">Email Us</h4>
                                <p className="text-slate-400 text-sm">support@mrfrental.com</p>
                                <p className="text-slate-400 text-sm">partners@mrfrental.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="text-foreground font-bold mb-1">Call Us</h4>
                                <p className="text-slate-400 text-sm">+1 (555) 000-8888</p>
                                <p className="text-slate-400 text-sm">Mon - Fri, 9am - 6pm EST</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-6">
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="text-foreground font-bold mb-1">Visit Us</h4>
                                <p className="text-slate-400 text-sm">123 Luxury Drive</p>
                                <p className="text-slate-400 text-sm">Beverly Hills, CA 90210</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                        <MessageSquare size={120} />
                    </div>

                    <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
                                <Input placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email Address</label>
                                <Input type="email" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Subject</label>
                            <Input placeholder="Inquiry about Tesla Model S" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Message</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none hover:bg-white/10 transition-colors"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <Button className="w-full gap-2 py-6">
                            <Send size={18} />
                            Send Message
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
