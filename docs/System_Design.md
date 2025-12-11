# System Configuration & Design

## Configuration Points
1. **Frontend**: `frontend/src/App.tsx` (Port 5173/5174)
2. **Backend**: `backend/src/server.ts` (Port 5000)
3. **Database**: `backend/src/config/db.ts` (Supabase connection)

## Architecture
- **Event Loop**: Node.js single-threaded non-blocking I/O.
- **Concurrency**: Postgres Transactions with Row-Level Locking.
- **Security**: Role-Based access (Admin/Patient).

See `README.md` for full setup.
