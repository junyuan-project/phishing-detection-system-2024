# Phishing Detection System (PDS)

A full-stack phishing detection and reporting platform. PDS helps users submit suspicious URLs, automatically scans them with urlscan.io, stores results for analyst review, and provides admin tools for triage and dataset curation. This project highlights backend engineering, API integration, database modelling, and full-stack delivery suitable for production-grade pipelines.

## 📌 Project Overview

PDS was developed as a demonstrable backend system for detecting, tracking, and managing suspected phishing URLs. It integrates third-party scanning (urlscan.io), persistent storage (MySQL + Sequelize), secure user management (bcrypt + JWT), and a React frontend that visualises scan results and admin dashboards.

This repository contains the backend (Express + Sequelize) and a React client. The deliverable shows strong backend-focus skills: API design, database modelling, authentication, async workflows, and secure third-party integration.

---

## ✨ Key Features

- Submit suspicious URLs for scanning and storage
- Integrates with urlscan.io to retrieve scanning UUIDs and results
- Persisted PhishURL records with status lifecycle (Pending → Scanned → Triaged)
- Admin endpoints to list, filter, update, and delete URL records
- User authentication and account management (bcrypt, JWT)
- Email and security-question models to support account features
- React-based frontend (Material UI) for submitting URLs and viewing reports

---

## API (Backend) — Core Endpoints

Base: http://localhost:5000 (default)

- POST /api/url/scan
  - Body: { "urlToScan": "https://..." }
  - Triggers urlscan.io scan and returns { uuid, result }

- POST /api/url/upload
  - Body: { "urlToUpload": "https://...", "user_id": "..." }
  - Stores URL record (status: Pending)

- GET /api/url/get-all-data?status=Pending
  - Query optional status to filter
  - Returns list of PhishURL records

- PUT /api/url/edit/:id
  - Body: { url_id, status }
  - Updates URL record with urlscan id and status

- DELETE /api/url/delete/:id
  - Deletes a stored URL record

---

## Architecture

- Presentation: React (client/) with Material UI and Chart.js for reporting
- API Layer: Express.js routes (server/) exposing REST endpoints
- Persistence: MySQL via Sequelize ORM (models under server/models)
- Integrations: urlscan.io (scanning), email validators
- Auth: bcrypt for password hashing, JWT for stateless authentication

The service uses a layered approach to separate routing, business logic, and data models for maintainability and testability.

---

## 🛠 Technology Stack

- Backend: Node.js, Express.js
- ORM / DB: Sequelize, MySQL (mysql2)
- Auth & Security: bcrypt, jsonwebtoken
- HTTP client: axios
- Frontend: React, Material UI
- Tooling: nodemon, sequelize-cli, Git

---

## 🚀 Installation

### Prerequisites

- Node.js (>=16)
- MySQL (or compatible) server
- npm

### Setup

1. Clone the repository
   git clone https://github.com/junyuan-project/phishing-detection-system-2024.git
2. Backend
   - cd server
   - Copy .env.example to .env and configure:
     - DB_HOST, DB_USER, DB_PASS, DB_NAME
     - JWT_SECRET
     - URLSCAN_API_KEY (do NOT commit real keys)
   - npm install
   - npm run start
3. Frontend
   - cd client
   - npm install
   - npm start

### Database

- Run Sequelize migrations or sync models to create tables (see server/models/index.js)

Security note: a urlscan API key is present in server/routes/URL.js during development. Move this into an environment variable for production use.

---

## Development Notes & Design Decisions

- Asynchronous scanning: the scan endpoint initiates a urlscan request, then polls (with a short delay) to fetch results by UUID. For production, replace the setTimeout polling with a robust polling/retry or webhook worker.
- Model-first approach: Sequelize models represent users, reported URLs, phishing records, and security questions for a clear domain model.
- Error handling: routes return appropriate 4xx/5xx codes. Centralised error middleware can be added to standardise responses.

---

## How to Test (Manual)

- Use Postman or curl to POST /api/url/scan with a urlToScan payload and confirm a UUID and result is returned.
- Upload URLs via /api/url/upload and query /api/url/get-all-data to confirm persistence.
- Edit and delete using the provided endpoints; confirm DB reflects changes.

---

## 🎯 Learning Outcomes

- Designing RESTful APIs for security-focused tooling
- Integrating and hardening third-party API usage
- Building resilient asynchronous workflows for external scans
- Data modelling with Sequelize and relational DB design
- Implementing authentication and secure password storage

---

## 🔮 Future Improvements

- Move urlscan API key into secure environment store / vault
- Replace ad-hoc polling with a worker queue (Bull/Redis) and webhooks
- Add unit/integration tests and CI pipeline (GitHub Actions)
- Containerise with Docker + Docker Compose and publish to cloud (AWS/GCP)
- Add role-based access control and audit logging
- Implement automated ML-based heuristics for rapid triage

---

## 👨‍💻 Author

JY Wong

Software Engineer specializing in backend development, API integration, and healthcare interoperability solutions.

LinkedIn: https://www.linkedin.com/in/jun-yuan-wong-66b094233/

GitHub: https://github.com/junyuan-project

---

## 📄 License

This project is developed for educational and portfolio purposes.
