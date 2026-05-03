import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Ban } from "lucide-react";
import { Button } from "../components/ui/Button";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-10"
            >
                <div className="text-[10rem] font-black text-foreground/5 select-none leading-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 rounded-full bg-rose-500/10 text-rose-500">
                        <Ban size={80} />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 max-w-md"
            >
                <h1 className="text-4xl font-bold text-foreground">Lost in the Fast Lane?</h1>
                <p className="text-slate-400 text-lg">
                    The page you're looking for seems to have taken a different route. Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="primary" className="gap-2" onClick={() => navigate("/")}>
                        <Home size={18} />
                        Home Page
                    </Button>
                    <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
