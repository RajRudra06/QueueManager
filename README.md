# Smart Queue & Appointment Manager

Flutter mobile app + Node.js/Express backend for real-time queue management and appointment scheduling.

## Implementation Status

Current phase: **Phase 2 complete (Demo-ready baseline)**

Selected decisions:
- Database: MongoDB Atlas
- Auth: Email/password + JWT + role-based authorization
- Realtime: Socket.IO from day one
- Scope: Extended MVP
- Demo operation: In-memory mode enabled by default when MongoDB is not configured

## Project Structure

- `mobile/` - Flutter app (student + admin flows)
- `server/` - Node.js + Express API + Socket.IO

## Implemented Features

- Auth: register, login, and profile endpoint
- Role-based access control: `STUDENT` and `ADMIN`
- Services API: list/create/update/delete
- Slots API: list/create/update/delete
- Appointments API (student): book, list mine, cancel, reschedule
- Admin queue API: queue snapshot + advance queue
- Queue ordering and capacity checks
- Socket.IO queue room updates (`queue:update`)
- Flutter app screens:
   - Auth page (login/register)
   - Student dashboard (browse services/slots, book, list/cancel appointments)
   - Admin dashboard (view queue and advance)

## Roadmap

1. Phase 0 - Foundation
   - Set up Flutter + Node dev environments
   - Scaffold mobile and server codebases
   - Add environment config and baseline architecture
2. Phase 1 - Backend Core
   - Auth, services, slots, appointments, queue lifecycle
   - Concurrency-safe booking, Socket.IO events, analytics hooks
3. Phase 2 - Flutter Core
   - Auth, student booking, queue tracking, admin controls, analytics views
4. Phase 3 - Reliability & Security
   - Validation, standardized errors, hardening, observability
5. Phase 4 - Testing & Demo Readiness
   - Backend tests, Flutter tests, seeded demo flow, UAT checklist

## Current Sprint (Completed)

1. Scaffold Flutter app in `mobile/`
2. Scaffold Express app in `server/`
3. Add domain APIs and queue logic
4. Wire Flutter UI to backend APIs
5. Verify API demo flow with smoke test

## Demo Credentials

- Student: `student@demo.local` / `student123`
- Admin: `admin@demo.local` / `admin123`

## Run Demo

1. Start backend:
   - `cd server`
   - `npm install`
   - `npm run dev`
2. Start Flutter app (new terminal):
   - `cd mobile`
   - `flutter pub get`
   - `flutter run`

Notes:
- Android emulator uses `http://10.0.2.2:4000/api`
- iOS simulator/macOS desktop uses `http://localhost:4000/api`
- Backend `.env` is pre-created for demo mode in `server/.env`

## API Smoke Test

Run this while backend is running:

- `cd server`
- `node smoke-test.js`

Expected outcome includes:
- Student and admin login success
- Booking created in `WAITING` status
- Queue visible to admin
- Queue advances to `COMPLETED`

## Verify

Completed verification:
- `flutter analyze` -> no issues found
- Backend health endpoint -> returns `200` status
- End-to-end smoke test script -> passed
