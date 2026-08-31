# MyWebsite Monorepo

A modern web platform built with a **Next.js** frontend and a containerized **PostgreSQL** database environment managed via Docker Compose.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Database & Services:** PostgreSQL 16, Adminer (Database Management)
- **Infrastructure:** Docker & Docker Compose

---

## 📁 Repository Structure

```text
mywebsite/
├── backend/               # Backend configurations & environment files
├── frontend/              # Next.js web application
│   ├── app/               # Page routes (/apps/smartwordsdictionary, /apps/gofrench, etc.)
│   ├── components/        # Reusable UI components
│   └── package.json       # Frontend dependencies & Next.js scripts
├── docker-compose.yml     # Docker services (Postgres & Adminer)
├── package.json           # Root orchestrator scripts
└── README.md
```
