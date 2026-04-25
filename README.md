# SmartSeason Field Monitoring System

A full-stack web application for tracking crop progress across multiple fields during a growing season. Built with ASP.NET Core (backend) and React + TypeScript (frontend).

## Live Demo

- **Frontend:** https://smart-season-field-monitoring.vercel.app
- **Backend API:** https://smartseason-field-monitoring-system-uc1y.onrender.com *( use the frontend link above to interact with the app this is not needed and is already running on cloud)*

## Demo Credentials

To test the application without registering, use:

**Admin**
- Email: `admin@smartseason.com`
- Password: `Admin@1234`

**Field Agent**
- Email: `agent@smartseason.com`
- Password: `Agent@1234`

> If these credentials do not work, register a new account directly on the app.

---

## Tech Stack

**Backend**
- ASP.NET Core 10 (Web API)
- Entity Framework Core with SQL Server (Azure SQL Database)
- ASP.NET Core Identity for authentication
- JWT Bearer tokens for authorization
- Docker for containerisation

**Frontend**
- React 18 + TypeScript
- Vite
- Axios
- Tailwind CSS
- Recharts for data visualisation
- React Router v6

---

## Features

### Roles & Access
- **Admin (Coordinator):** Full access — manage fields, assign agents, monitor all updates across the system
- **Field Agent:** Restricted access — view only assigned fields and submit stage updates with notes

### Field Management
- Create, view, and manage fields with name, crop type, planting date, and current stage
- Assign fields to field agents
- Field lifecycle: `Planted → Growing → Ready → Harvested`

### Field Status Logic
Each field has a computed status:

| Status | Logic |
|--------|-------|
| **Completed** | Field stage is `Harvested` |
| **At Risk** | Field is in `Ready` stage but has not been updated in 14+ days |
| **Active** | All other fields |

This logic is applied on the frontend using the `lastUpdatedAt` timestamp and `currentStage` values returned by the API.

### Dashboards
- **Admin dashboard:** Total fields, active agents, risk candidates, stage and status charts, quick action links
- **Field Agent dashboard:** Assigned fields, stage breakdown, recent update history

---

## Local Setup

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- SQL Server (local) or Docker

### Backend

```bash
git clone https://github.com/edwinsupremacy/SmartSeason-Field-Monitoring-System-Backend
cd SmartSeason-Field-Monitoring-System-Backend
```

Update `appsettings.json` with your local SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartSeasonDB;Trusted_Connection=True;"
  },
  "JWT": {
    "Issuer": "http://localhost:5112",
    "Audience": "http://localhost:5112",
    "SigningKey": "x8k3j9f0sld9q2m8v7c1p5z9a0r8t6w2n4b9h1k7j3f6s0d9l2q8w1e7r5t9y3u6i0o4p8a2s7d5f9g1h3j6k8l0"
  }
}
```

Run migrations and start the server:

```bash
dotnet ef database update
dotnet run
```

API runs at `http://localhost:5112`

### Frontend

```bash
git clone https://github.com/edwinsupremacy/SmartSeason-Field-Monitoring-System-Frontend
cd SmartSeason-Field-Monitoring-System-Frontend
npm install
```

Create a `.env` file in the root:
