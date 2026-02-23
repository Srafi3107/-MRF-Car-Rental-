Car Rental Management System

A full-stack, enterprise-grade Car Rental Management System built with a
Java OOP backend and a React frontend.

------------------------------------------------------------------------

KEY FEATURES

[Advanced Security] - Multi-Stage Password Reset (Admin approval
required) - Role-Based Access Control (Customer & Admin separation)

[Fleet & Booking Management] - Dynamic fleet management with image
persistence - Smart booking engine with automated price calculation -
Customer booking history & profile management

[Premium User Experience] - Glassmorphism dark UI - Smooth
micro-animations - Real-time toast notifications

------------------------------------------------------------------------

TECHNICAL ARCHITECTURE

Backend (Java) - Custom web server using com.sun.net.httpserver -
Layered architecture: Controller → Service → Model - CSV-based file
storage - Centralized CORS handling

Frontend (React 19) - Functional components with Hooks - Custom Vanilla
CSS design system - Authentication state management - Real-time fleet
synchronization

------------------------------------------------------------------------

PROJECT STRUCTURE

CAR RENT/ │ ├── backend_rent/ │ ├── src/handler/ │ ├── src/model/ │ ├──
src/service/ │ └── *.txt │ ├── frontend/ │ ├── src/api/ │ ├── src/pages/
│ └── src/components/ │ └── Car pics/

------------------------------------------------------------------------

QUICK START

Backend: cd backend_rent/src javac Main.java java Main (Server runs on
http://localhost:8080)

Frontend: cd frontend npm install npm start (App runs on
http://localhost:3000)

------------------------------------------------------------------------

Admin Login: Username: admin Password: admin123
