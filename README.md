# Doctor Appointment Booking System

## Overview
This is a full-stack Doctor Appointment Booking application developed for the Modex Assessment. It allows admins to manage doctors and appointment slots, and users (patients) to book available slots with real-time concurrency handling.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Vanilla CSS (with CSS Modules), Radix UI (via v0 components).
- **Backend**: Node.js, Express.js, PostgreSQL (Supabase).
- **Database**: Supabase Postgres with Transaction Mode (PgBouncer).

## Features
- **Admin Dashboard**: Add Doctors, Create Slots.
- **Patient Booking**: View Doctors, Check Slot Availability, Book Appointments.
- **Concurrency Control**: Robust locking mechanism ensures no double bookings.
- **Responsive UI**: Clean, medical-themed interface.

## Prerequisites
- Node.js (v18+)
- Postgres Database URL (Supabase Transaction Mode recommended)

## Setup & Run

### 1. Clone Repository
```bash
git clone https://github.com/Kushal-V/Doctor-Appointment-App.git
cd Doctor-Appointment-App
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file with DATABASE_URL and PORT
# (See .env.example)
npm run init-db  # Initialize Database Schema
npm start        # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

## API Endpoints
- `GET /api/doctors` - List all doctors
- `POST /api/doctors` - Create a doctor
- `POST /api/slots` - Create a slot
- `GET /api/slots?doctorId=?` - List slots for a doctor
- `POST /api/bookings` - Book a slot

## System Design
See `docs/System_Design.md` for architectural details.
