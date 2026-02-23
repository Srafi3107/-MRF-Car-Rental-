import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: "60vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "1.5rem",
                    backgroundColor: "var(--col-navy-900)",
                    borderRadius: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.05)",
                    margin: "1.5rem",
                }}>
                    <div style={{ padding: "1.5rem", borderRadius: "9999px", background: "rgba(245,158,11,0.1)", color: "#f59e0b", marginBottom: "1.5rem" }}>
                        <AlertTriangle size={48} />
                    </div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>Something went wrong</h2>
                    <p style={{ color: "#94a3b8", marginBottom: "2rem", maxWidth: "24rem" }}>
                        We encountered an unexpected error while rendering this page.
                    </p>
                    <Button variant="primary" className="btn-gap" onClick={() => window.location.reload()}>
                        <RefreshCw size={18} />
                        Reload Application
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
