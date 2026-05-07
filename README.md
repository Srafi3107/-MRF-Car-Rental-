<<<<<<< HEAD
# 🚗 MRF Car Rental Management System

[![Java](https://img.shields.io/badge/Backend-Java-orange.svg)](https://www.java.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, enterprise-grade car rental platform. This system features a **zero-dependency custom Java HTTP server** and a **premium React 19 frontend** with glassmorphism aesthetics.

---

## ✨ Key Features

### 🔐 Advanced Security Flow
- **Multi-Stage Reset**: A robust, Admin-approved password reset system. Requests are submitted by users and must be manually approved by an Admin before finalization.
- **RBAC**: Role-Based Access Control enforcing strict separation between **Customer** and **Admin** consoles.

### 🚘 Fleet & Booking Management
- **Dynamic Fleet**: Real-time management of vehicles with rich descriptions and **binary image persistence**.
- **Technical Specs**: Detailed vehicle information including **Fuel Type**, **Transmission**, **Seating Capacity**, and **Year**.
- **Booking Engine**: Sophisticated availability tracking and automated price calculation based on rental duration.
- **Customer Insights**: Detailed booking history and profile management for registered users.

### 🎨 Premium User Experience
- **Glassmorphism UI**: High-end dark theme design using modern CSS tokens.
- **Micro-animations**: Smooth transitions and interactive elements powered by **Framer Motion**.
- **Real-time Feedback**: Instant notifications and toast alerts for all system actions.

---

## 🛠️ Technical Architecture

### Backend (Java)
- **Custom Web Server**: Built using `com.sun.net.httpserver` to demonstrate deep understanding of HTTP protocols without heavy frameworks.
- **Service-Oriented Design**: Clean separation of concerns between Controllers (Handlers), Services, and Models.
- **File Persistence**: Lightweight CSV-based data storage for zero-config deployment.
- **Unified CORS**: Advanced Cross-Origin Resource Sharing handling for secure frontend-backend communication.

### Frontend (React)
- **Modern Stack**: React 19 with Function Components and Hooks.
- **Design System**: A custom-built Vanilla CSS framework prioritized for performance and visual excellence.
- **State Management**: Robust handling of authentication sessions and real-time fleet synchronization.

---

## 📂 Project Structure

```text
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
```

---

## 🚀 Quick Start

1. **Backend**: Compile and run `Main.java` inside `backend_rent/src/`. The server will start on port `8080`.
2. **Frontend**: Run `npm install` and `npm start` in the `frontend/` directory.
3. **Verify**: Log in as `admin` (password: `admin123`) to access the Security Panel and approve reset requests!

---

## 🔮 Future Enhancements

### 🤖 AI-Powered Assistant & Smart UI
- **AI Assistant Integration**: Embed an intelligent assistant (chat-based) to help users:
    - Find available cars based on natural language queries (e.g., “SUV under $50 for 3 days”)
    - Get booking suggestions and pricing insights
- **AI-Driven Recommendations**: Personalized vehicle recommendations using user behavior and booking history.
- **Smart Search & Filtering**: Semantic search instead of basic keyword filtering.
- **Voice UI (Optional)**: Enable voice-based booking interactions for improved accessibility.

### ⚙️ Backend Evolution (Node.js Microservices)
- **Node.js API Layer**: Introduce a scalable backend using Node.js (Express/NestJS) alongside or replacing the custom Java server.
- **Microservices Architecture**:
    - Auth Service (JWT/OAuth)
    - Booking Service
    - Fleet Management Service
- **Database Upgrade**:
    - Move from CSV → PostgreSQL / MongoDB.
    - Implement indexing and caching (Redis) for performance.
- **Real-Time Features**:
    - WebSocket-based booking updates and notifications.
- **Cloud Deployment**:
    - Dockerize services and deploy via AWS/GCP.
    - CI/CD pipeline integration (GitHub Actions).
=======
# 🚗 MRF Car Rental Management System

[![Java](https://img.shields.io/badge/Backend-Java-orange.svg)](https://www.java.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, enterprise-grade car rental platform. This system features a **zero-dependency custom Java HTTP server** and a **premium React 19 frontend** with glassmorphism aesthetics.

---

## ✨ Key Features

### 🔐 Advanced Security Flow
- **Multi-Stage Reset**: A robust, Admin-approved password reset system. Requests are submitted by users and must be manually approved by an Admin before finalization.
- **RBAC**: Role-Based Access Control enforcing strict separation between **Customer** and **Admin** consoles.

### 🚘 Fleet & Booking Management
- **Dynamic Fleet**: Real-time management of vehicles with rich descriptions and **binary image persistence**.
- **Technical Specs**: Detailed vehicle information including **Fuel Type**, **Transmission**, **Seating Capacity**, and **Year**.
- **Booking Engine**: Sophisticated availability tracking and automated price calculation based on rental duration.
- **Customer Insights**: Detailed booking history and profile management for registered users.

### 🎨 Premium User Experience
- **Glassmorphism UI**: High-end dark theme design using modern CSS tokens.
- **Micro-animations**: Smooth transitions and interactive elements powered by **Framer Motion**.
- **Real-time Feedback**: Instant notifications and toast alerts for all system actions.

---

## 🛠️ Technical Architecture

### Backend (Java)
- **Custom Web Server**: Built using `com.sun.net.httpserver` to demonstrate deep understanding of HTTP protocols without heavy frameworks.
- **Service-Oriented Design**: Clean separation of concerns between Controllers (Handlers), Services, and Models.
- **File Persistence**: Lightweight CSV-based data storage for zero-config deployment.
- **Unified CORS**: Advanced Cross-Origin Resource Sharing handling for secure frontend-backend communication.

### Frontend (React)
- **Modern Stack**: React 19 with Function Components and Hooks.
- **Design System**: A custom-built Vanilla CSS framework prioritized for performance and visual excellence.
- **State Management**: Robust handling of authentication sessions and real-time fleet synchronization.

---

## 📂 Project Structure

```text
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
```

## 🔮 Future Enhancements

### 🤖 AI-Powered Assistant & Smart UI
- **AI Assistant Integration**: Embed an intelligent assistant (chat-based) to help users:
    - Find available cars based on natural language queries (e.g., “SUV under $50 for 3 days”)
    - Get booking suggestions and pricing insights
- **AI-Driven Recommendations**: Personalized vehicle recommendations using user behavior and booking history.
- **Smart Search & Filtering**: Semantic search instead of basic keyword filtering.
- **Voice UI (Optional)**: Enable voice-based booking interactions for improved accessibility.

### ⚙️ Backend Evolution (Node.js Microservices)
- **Node.js API Layer**: Introduce a scalable backend using Node.js (Express/NestJS) alongside or replacing the custom Java server.
- **Microservices Architecture**:
    - Auth Service (JWT/OAuth)
    - Booking Service
    - Fleet Management Service
- **Database Upgrade**:
    - Move from CSV → PostgreSQL / MongoDB.
    - Implement indexing and caching (Redis) for performance.
- **Real-Time Features**:
    - WebSocket-based booking updates and notifications.
- **Cloud Deployment**:
    - Dockerize services and deploy via AWS/GCP.
    - CI/CD pipeline integration (GitHub Actions).
>>>>>>> 1862453a30dff478a7dacd7c7ceed7d16f841ed6
