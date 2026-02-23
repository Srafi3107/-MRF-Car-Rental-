# 🚗 Car Rental Management System

A full-stack, enterprise-grade Car Rental Management System built with a **Java OOP** backend and a **React** frontend. This project demonstrates clean architecture, robust data validation, and a premium user experience.

---

✨ Key Features
🔐 Advanced Security Flow
Multi-Stage Reset: A robust, Admin-approved password reset system. Requests are submitted by users and must be manually approved by an Admin before finalization.
RBAC: Role-Based Access Control enforcing strict separation between Customer and Admin consoles.
🚘 Fleet & Booking Management
Dynamic Fleet: Real-time management of vehicles with rich descriptions and binary image persistence.
Booking Engine: Sophisticated availability tracking and automated price calculation based on rental duration.
Customer Insights: Detailed booking history and profile management for registered users.
🎨 Premium User Experience
Glassmorphism UI: High-end dark theme design using modern CSS tokens.
Micro-animations: Smooth transitions and interactive elements powered by Framer Motion.
Real-time Feedback: Instant notifications and toast alerts for all system actions.
🛠️ Technical Architecture
Backend (Java)
Custom Web Server: Built using com.sun.net.httpserver to demonstrate deep understanding of HTTP protocols without heavy frameworks.
Service-Oriented Design: Clean separation of concerns between Controllers (Handlers), Services, and Models.
File Persistence: Lightweight CSV-based data storage for zero-config deployment.
Unified CORS: Advanced Cross-Origin Resource Sharing handling for secure frontend-backend communication.
Frontend (React)
Modern Stack: React 19 with Function Components and Hooks.
Design System: A custom-built Vanilla CSS framework prioritized for performance and visual excellence.
State Management: Robust handling of authentication sessions and real-time fleet synchronization.
📂 Project Structure
text
CAR RENT/
├── backend_rent/           # Custom Java Server source
│   ├── src/handler/        # API Controllers & CORS logic
│   ├── src/model/          # Domain Objects (Car, User, Booking)
│   ├── src/service/        # Core Business Logic
│   └── *.txt               # Data Persistence Layer
├── frontend/               # React 19 Application
│   ├── src/api/            # Service Layer (Axios/Fetch)
│   ├── src/pages/          # Premium Dashboard Views
│   └── src/components/     # Reusable Atomic Components
└── Car pics/               # Persistent Binary Image Storage
🚀 Quick Start
Backend: Compile and run Main.java inside backend_rent/src/. The server will start on port 8080.
Frontend: Run npm install and npm start in the frontend/ directory.
Verify: Log in as admin (password: admin123) to access the Security Panel and approve reset requests!
