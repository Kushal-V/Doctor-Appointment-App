# System Design Document - Doctor Appointment System

## Architecture
The system follows a typical Client-Server architecture:
- **Client**: React SPA (Single Page Application) enabling dynamic interactions.
- **Server**: Node.js/Express REST API serving JSON data.
- **Database**: PostgreSQL relational database for persistent storage.

## Data Model
### Doctors
- `id`: UUID (PK)
- `name`: String
- `specialization`: String
- `created_at`: Timestamp

### Slots
- `id`: UUID (PK)
- `doctor_id`: UUID (FK)
- `start_time`: Timestamp
- `end_time`: Timestamp

### Bookings
- `id`: UUID (PK)
- `slot_id`: UUID (FK)
- `patient_name`: String
- `status`: Enum (PENDING, CONFIRMED, FAILED)
- `created_at`: Timestamp

## Concurrency Handling
To prevent **Race Conditions** (Double Booking), we utilize Postgres features:
1. **Transactions (`BEGIN`...`COMMIT`)**: Ensures atomic operations.
2. **Partial Unique Index**: 
   ```sql
   CREATE UNIQUE INDEX unique_active_booking 
   ON bookings (slot_id) 
   WHERE status IN ('PENDING', 'CONFIRMED');
   ```
   This database constraint guarantees that only one active booking can exist for a slot at any given time. If two concurrent requests try to insert a booking for the same slot, one will succeed and the other will fail with a Unique Constraint Violation (Error 23505), which the backend catches and returns as a 409 Conflict.

## API Design
RESTful principles are followed. Resource-oriented URLs (`/doctors`, `/slots`) and standard HTTP verbs (`GET`, `POST`).

## Scalability
- **Stateless Backend**: The Express server is stateless, allowing horizontal scaling behind a load balancer.
- **Connection Pooling**: Uses Supabase Transaction Mode (PgBouncer) to handle high concurrent connections efficiently.
