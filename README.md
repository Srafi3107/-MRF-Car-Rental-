# 🚗 Car Rental Management System

A full-stack, enterprise-grade Car Rental Management System built with a **Java OOP** backend and a **React** frontend. This project demonstrates clean architecture, robust data validation, and a premium user experience.

---

## ✨ Features

### 👤 User Roles
- **Admin**: Full control over car inventory, user management, and booking oversight.
- **Customer**: Browse available cars, rent vehicles, view booking history, and manage profiles.

### 🛠️ Core Functionality
- **Car Management**: Add, update, and delete cars with image support (Base64).
- **Booking System**: Real-time availability tracking and automated price calculation based on rental duration.
- **Authentication**: Secure login and registration with role-based access control.
- **Password Recovery**: Admin-approved password reset system.
- **Analytics Dashboard**: Visual representation of bookings and revenue using dynamic charts.
- **Responsive UI**: Premium design with glassmorphism effects and smooth animations.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: React 19
- **Routing**: React Router 7
- **Styling**: Vanilla CSS (Premium Design System)
- **Charts**: Recharts
- **Icons**: Lucide React (or equivalent SVGs)

### Backend
- **Language**: Java
- **Architecture**: Service-Oriented (OOP Principles)
- **Persistence**: File-based storage (`data/*.txt`) for lightweight deployment.
- **Server**: Custom HTTP Server implementation.

---

## 📂 Project Structure

```text
CAR RENT/
├── backend/                # Java Backend Source
│   ├── src/com/carrental/
│   │   ├── handler/        # HTTP Request Handlers
│   │   ├── model/          # Data Models (Car, User, Booking)
│   │   ├── repository/     # File Persistence Logic
│   │   └── service/        # Business Logic
│   └── data/               # Persistent Storage (TXT Files)
├── frontend/               # React Frontend Source
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Full Page Views
│   │   └── styles/         # Global CSS & Design Tokens
│   └── public/             # Static Assets
└── system_diagrams.md      # Architecture & ERD Diagrams
```

---
Admin Login Details:
Username: admin
Password: admin123
