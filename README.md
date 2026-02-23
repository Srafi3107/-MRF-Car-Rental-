🚗 Car Rental Management System

A full-stack, enterprise-grade Car Rental Management System built with a Java OOP backend and a React frontend.

This project demonstrates clean architecture, robust data validation, and a premium user experience.

✨ Key Features
🔐 Advanced Security Flow

Multi-Stage Password Reset – Users submit reset requests that must be manually approved by an Admin.

RBAC (Role-Based Access Control) – Strict separation between Customer and Admin consoles.

🚘 Fleet & Booking Management

Dynamic Fleet Management – Real-time vehicle management with rich descriptions and binary image persistence.

Smart Booking Engine – Availability tracking with automated rental price calculation.

Customer Insights – Booking history and profile management for registered users.

🎨 Premium User Experience

Glassmorphism UI – Modern dark theme with elegant styling.

Micro-animations – Smooth transitions powered by Framer Motion.

Real-time Feedback – Instant toast notifications for all actions.

🛠️ Technical Architecture
🔙 Backend (Java)

Custom Web Server built using com.sun.net.httpserver

Service-Oriented Architecture (Controller → Service → Model)

CSV-based file persistence (zero database setup)

Centralized CORS configuration

Clean separation of concerns

🔜 Frontend (React 19)

Functional Components + Hooks

Custom lightweight Vanilla CSS design system

Authentication state management

Real-time fleet synchronization

📂 Project Structure
CAR RENT/
│
├── backend_rent/            # Custom Java Server
│   ├── src/handler/         # API Controllers & CORS logic
│   ├── src/model/           # Domain Models (Car, User, Booking)
│   ├── src/service/         # Business Logic Layer
│   └── *.txt                # CSV Data Storage
│
├── frontend/                # React Application
│   ├── src/api/             # API Service Layer
│   ├── src/pages/           # Dashboard Views
│   └── src/components/      # Reusable Components
│
└── Car pics/                # Binary Image Storage
🚀 Quick Start
1️⃣ Backend Setup
cd backend_rent/src
javac Main.java
java Main

Server runs on:

http://localhost:8080
2️⃣ Frontend Setup
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3000
🔑 Admin Access
Username: admin
Password: admin123

Use the Security Panel to approve password reset requests.

📌 Highlights

✔ Enterprise-style layered architecture
✔ Zero external backend frameworks
✔ Real production-style booking logic
✔ Secure role-based authorization
✔ Clean modern UI

If you'd like, I can also:

🔥 Make it more "recruiter-impressive"

🏢 Make it enterprise portfolio style

🧠 Add system architecture diagram section

🌍 Add deployment guide (Render / Railway / VPS)

🛡️ Add API documentation section

Tell me what style you want for your GitHub profile 🚀
