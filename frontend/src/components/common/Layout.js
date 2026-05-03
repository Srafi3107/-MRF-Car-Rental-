import React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "sonner";

const Layout = ({ children }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {!isAuthPage && <Navbar />}

            <main style={{ flexGrow: 1, paddingTop: isAuthPage ? 0 : "6rem" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ width: "100%" }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {!isAuthPage && <Footer />}
            <Toaster position="top-center" richColors theme="light" />
        </div>
    );
};

export default Layout;
