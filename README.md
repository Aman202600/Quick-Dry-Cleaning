# QuickDry Laundry Order Management System

A complete MERN stack application for managing laundry orders, tracking status transitions, and viewing business analytics.

## Tech Stack
- **Frontend**: React (Vite), React Router v6, Axios, Tailwind CSS, Lucide Icons, Date-fns.
- **Backend**: Node.js, Express.js (REST API).
- **Database**: MongoDB with Mongoose ODM.
- **Styling**: Modern, premium UI with glassmorphism and smooth transitions.

## Project Structure
- `/backend`: Express API, Mongoose Models, Controllers, and Seeding script.
- `/frontend`: React SPA, Custom Hook-like API services, and Responsive UI components.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a remote Atlas URI)

### Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env`: Change `MONGO_URI` if needed.
4. Scale up: `node seed.js` (Optional: Seeds 10 sample orders).
5. Start server: `npm run dev` (uses `nodemon` if installed, or `node server.js`).

### Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access the app at `http://localhost:5173`.

## Features Implemented
- **Dashboard**: High-level stats, revenue tracking, and status breakdown.
- **Order Management**: Search, filter by status/name/phone/garment.
- **Order Workflow**: Strict `RECEIVED → PROCESSING → READY → DELIVERED` transitions.
- **Live Bill Preview**: Real-time calculation of totals based on garment types.
- **ID Generation**: Unique `ORD-YYYYMMDD-XXXX` format.
- **Validation**: 10-digit phone validation and garment quantity checks.

## AI Usage Report
- **Tools used**: Antigravity (Gemini 2.0 / 1.5 Pro).
- **Sample prompts used**: "Build a complete Mini Laundry Order Management System from scratch...", "Create a high-end React dashboard for a laundry app using Tailwind CSS."
- **AI Correctness**: 
  - AI correctly implemented the status transition logic on the first attempt.
  - Custom primary color palette was suggested by AI to give a "premium" feel.
  - AI fixed the initial PowerShell command syntax error (`&&` vs `;`).
- **Manual Work**: 
  - Polished the layout spacing and animations.
  - Refined the `OrderCard` design for better mobile responsiveness.

## Tradeoffs
- **Auth**: Skipped JWT auth as it was optional, focusing on core functionality.
- **Counters**: Used a random suffix for Order ID instead of a persistent daily counter collection for architectural simplicity.
- **Future Improvements**:
  - Add User Authentication (Admin/Staff).
  - Print Invoice feature.
  - SMS/WhatsApp notifications on status change.
  - Multi-shop support.

---
Created with ❤️ by Antigravity
