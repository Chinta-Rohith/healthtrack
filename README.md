# HealthTrack — Patient Symptom Monitoring Platform

HealthTrack is a full-stack healthcare symptom tracking web application built with **React (Vite + Tailwind CSS + Recharts)**, **Java 17 / Spring Boot**, and **MySQL**. It allows patients to log daily symptoms, rate severity on a structured 1–10 scale, inspect their chronological symptom history, and monitor 30-day daily average severity trends.

> **Disclaimer:** HealthTrack is a personal symptom tracking and visualization tool only. It is **not** a medical diagnostic system, clinical decision-support tool, or emergency medical service. Severity labels (`Mild`, `Moderate`, `High`, `Severe`) are interface descriptions only. Sample data under `PATIENT001` is strictly non-real demonstration data.

---

## Table of Contents

- [Main Features](#main-features)
- [Technology Stack](#technology-stack)
- [Architecture Explanation](#architecture-explanation)
- [Key Design Decisions](#key-design-decisions)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Prerequisites](#prerequisites)
- [MySQL Setup Instructions](#mysql-setup-instructions)
- [Backend Installation and Execution](#backend-installation-and-execution)
- [Frontend Installation and Execution](#frontend-installation-and-execution)
- [Testing Instructions](#testing-instructions)
- [Sample Patient ID & Demonstration Data](#sample-patient-id--demonstration-data)
- [Screenshots](#screenshots)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)
- [AI Usage](#ai-usage)

---

## Main Features

- **Dashboard Overview**: Displays active patient ID, total logged symptoms, average severity, highest recorded severity, recent symptom activity, and a 30-day severity trend chart.
- **Guided Symptom Logging**: Validated form with Patient ID, 500-character symptom description counter, interactive 1–10 severity scale (`Mild`, `Moderate`, `High`, `Severe`), duplicate-submission protection, and instant API feedback.
- **Chronological Symptom History**: Clean data table showing symptom description, severity badge, local formatted date and time, client-side search filter, and chronological ascending order (latest entries at the bottom).
- **30-Day Health Analytics**: Responsive Recharts line chart displaying daily average severity over the last 30 days with tooltips, grid lines, and honest empty-data handling (never fabricates missing trends).
- **Centralized Error Handling & Validation**: Strict Bean Validation on the backend, whitespace trimming, UTC timestamp normalization, and user-friendly error messages without exposing database details.
- **Patient Data Isolation**: Every read and aggregation query is strictly scoped to the requested `patientId`.

---

## Technology Stack

### Frontend
- **React.js** (with **Vite**)
- **Tailwind CSS**
- **Recharts** (30-day trend line chart)
- **Lucide React** (UI icons)
- **Axios** (centralized REST API client)
- **React Router** (`react-router-dom`)
- **Vitest + React Testing Library** (automated UI & validation tests)

### Backend
- **Java 17** (bytecode target `maven.compiler.release=17`)
- **Spring Boot 3.4.5**
- **Spring Web**
- **Spring Data JPA** / **Hibernate**
- **Spring Boot Validation (Bean Validation)**
- **Maven**
- **JUnit 5 + Mockito + Spring Boot Test (MockMvc + H2 test profile)**

### Database
- **MySQL 8.0**

---

## Architecture Explanation

HealthTrack separates frontend presentation from backend business logic and database persistence:

```text
HealthTrack/
├── frontend/
│   ├── src/
│   │   ├── assets/          # Brand SVG logo
│   │   ├── components/      # Reusable UI components (Sidebar, TopBar, SymptomForm, SeverityTrendChart, etc.)
│   │   ├── hooks/           # Custom React hook (usePatientSymptoms) for API fetching & metric aggregation
│   │   ├── pages/           # Route views (Dashboard, Log Symptoms, Symptom History, Health Analytics, About)
│   │   ├── services/        # Centralized Axios instance & API helpers (api.js)
│   │   ├── test/            # Vitest & React Testing Library specs
│   │   ├── utils/           # Severity metadata, validation helpers, date/time formatters
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/main/java/com/healthtrack/
│   │   ├── controller/      # REST API endpoints (/api/symptoms)
│   │   ├── service/         # Validation, UTC timestamping, and 30-day trend aggregation
│   │   ├── repository/      # Parameterized Spring Data JPA queries
│   │   ├── entity/          # JPA entity mapped to symptom_logs
│   │   ├── dto/             # Request, Response, Trend, Success, and Error DTOs
│   │   ├── exception/       # @RestControllerAdvice centralized exception handling
│   │   └── config/          # CORS, JSON string trimming, UTC Clock, and idempotent demo seeder
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── schema.sql       # MySQL DDL for symptom_logs
│   │   └── data.sql         # Sample SQL seed script for PATIENT001
│   ├── src/test/            # Unit tests (Mockito) & MockMvc integration tests
│   └── pom.xml
├── .env.example
├── .gitignore
└── README.md
```

---

## Key Design Decisions

- **Layered Separation & Constructor Injection**: Splitting the backend into `controller`, `service`, `repository`, `entity`, `dto`, `exception`, and `config` keeps HTTP routing, business logic, and persistence cleanly testable. All dependencies (including a UTC `Clock` bean) use constructor injection so unit tests run deterministically with fixed timestamps.
- **Consistent UTC Storage & Local Browser Formatting**: `SymptomService` generates `Instant.now(clock)` in UTC, Hibernate persists `DATETIME(6)` with `hibernate.jdbc.time_zone=UTC`, and Jackson serializes ISO-8601 UTC strings (`Z`) so React renders dates and times accurately in each user's local timezone.
- **Pre-Validation Whitespace Normalization**: `WebConfig` registers a Jackson `String` deserializer that trims leading/trailing whitespace prior to Bean Validation, ensuring whitespace-only descriptions (`"   "`) fail `@NotBlank` cleanly instead of slipping through as non-empty text.
- **Chronological 30-Day Aggregation via `TreeMap`**: `GET /api/symptoms/{patientId}/trends` filters records from the past 30 UTC days, groups by `LocalDate` inside a `TreeMap` (guaranteeing chronological sorting), and computes daily averages without fabricating points on days with zero logs.
- **Patient Isolation & Composite Indexing**: All read and trend queries filter strictly by `patientId` via parameterized Spring Data JPA methods backed by a composite index `idx_symptom_patient_timestamp (patient_id, timestamp)`.
- **Sanitized Centralized Errors & Duplicate-Submit Protection**: `@RestControllerAdvice` (`GlobalExceptionHandler`) maps validation, malformed JSON, and database outages (`503`) to consistent JSON error payloads without leaking stack traces or DB credentials, while `SymptomForm.jsx` disables submission while requests are in flight.

---

## Database Schema

Table: `symptom_logs` (MySQL InnoDB, `utf8mb4`)

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique auto-generated record identifier |
| `patient_id` | `VARCHAR(50)` | `NOT NULL` | Patient identifier |
| `description` | `VARCHAR(500)` | `NOT NULL` | Trimmed symptom description |
| `severity` | `INT` | `NOT NULL`, `CHECK (severity >= 1 AND severity <= 10)` | Severity score from 1 to 10 |
| `timestamp` | `DATETIME(6)` | `NOT NULL` | Server-generated UTC timestamp |

**Index:** `idx_symptom_patient_timestamp (patient_id, timestamp)` — optimizes patient-isolated chronological retrieval and 30-day date range queries.

---

## API Documentation

Base URL: `http://localhost:8080/api`

### 1. Create a Symptom Entry
**`POST /api/symptoms`**

Request Body:
```json
{
  "patientId": "PATIENT001",
  "description": "Headache",
  "severity": 7
}
```

Success Response (`201 Created`):
```json
{
  "success": true,
  "message": "Symptom entry recorded successfully.",
  "data": {
    "id": 8,
    "patientId": "PATIENT001",
    "description": "Headache",
    "severity": 7,
    "timestamp": "2026-11-25T13:10:00Z"
  }
}
```

Validation Error Response (`400 Bad Request`):
```json
{
  "timestamp": "2026-11-25T13:10:05Z",
  "status": 400,
  "error": "Validation Failed",
  "message": "Severity must be between 1 and 10.",
  "path": "/api/symptoms",
  "fieldErrors": {
    "severity": "Severity must be between 1 and 10."
  }
}
```

### 2. Retrieve Patient Symptom History
**`GET /api/symptoms/{patientId}`**

Returns all records belonging strictly to `{patientId}`, sorted by `timestamp` ascending. Returns `[]` if no records exist.

Success Response (`200 OK`):
```json
[
  {
    "id": 1,
    "patientId": "PATIENT001",
    "description": "Mild tension headache after extended morning screen time",
    "severity": 3,
    "timestamp": "2026-11-04T11:00:00Z"
  }
]
```

### 3. Retrieve 30-Day Severity Trends
**`GET /api/symptoms/{patientId}/trends`**

Filters entries to the previous 30 days (UTC), groups by date, computes daily average severity, and returns results sorted chronologically.

Success Response (`200 OK`):
```json
[
  {
    "date": "2026-11-13",
    "averageSeverity": 6.0,
    "entryCount": 2
  },
  {
    "date": "2026-11-17",
    "averageSeverity": 6.0,
    "entryCount": 1
  }
]
```

---

## Prerequisites

- **Java Development Kit (JDK) 17** or newer (compiled with `--release 17`)
- **Apache Maven 3.9+**
- **Node.js 18+** and **npm 9+**
- **MySQL Server 8.0**

---

## MySQL Setup Instructions

1. Start your local MySQL 8.0 server.
2. Create the database (optional — `createDatabaseIfNotExist=true` is enabled in `application.properties`, or run manually):
   ```sql
   CREATE DATABASE IF NOT EXISTS healthtrack
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```
3. (Optional) Initialize the schema and sample rows manually using the provided SQL scripts:
   ```bash
   mysql -u root -p healthtrack < backend/src/main/resources/schema.sql
   mysql -u root -p healthtrack < backend/src/main/resources/data.sql
   ```
   > When the Spring Boot backend starts with `HEALTHTRACK_SEED_ENABLED=true`, `SampleDataInitializer` also automatically seeds 7 demonstration records for `PATIENT001` if none exist.

4. Copy `.env.example` to `.env` in the `HealthTrack/` root and set your MySQL credentials (never commit `.env`):
   ```bash
   cp .env.example .env
   ```

---

## Backend Installation and Execution

Set the environment variables from `.env` (or export them in your shell) and run Spring Boot:

**PowerShell (Windows):**
```powershell
cd HealthTrack/backend
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="healthtrack"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
mvn spring-boot:run
```

**macOS / Linux:**
```bash
cd HealthTrack/backend
export DB_HOST=localhost DB_PORT=3306 DB_NAME=healthtrack DB_USERNAME=root DB_PASSWORD=your_mysql_password
mvn spring-boot:run
```

The backend API will start at `http://localhost:8080`.

---

## Frontend Installation and Execution

```bash
cd HealthTrack/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To override the backend URL, set `VITE_API_BASE_URL` in `HealthTrack/frontend/.env` (defaults to `http://localhost:8080/api`).

---

## Testing Instructions

### Backend Tests (JUnit 5 + Mockito + Spring Boot Test)
Backend tests use an isolated H2 in-memory database configured in MySQL compatibility mode (`application-test.properties`), so they can run without modifying your local MySQL database:

```bash
cd HealthTrack/backend
mvn test
```

Covered scenarios:
- `SymptomServiceTest`: Valid creation + whitespace trimming, empty description rejection, severity `< 1` and `> 10` rejection, retrieving >= 5 sorted records, and 30-day daily average trend aggregation.
- `SymptomControllerIntegrationTest`: Full `MockMvc` HTTP + JPA persistence verification for `POST /api/symptoms`, `GET /api/symptoms/{patientId}`, patient isolation, empty array response, and `GET /api/symptoms/{patientId}/trends`.

### Frontend Tests (Vitest + React Testing Library)
```bash
cd HealthTrack/frontend
npm test
```

Covered scenarios (`SymptomForm.test.jsx`):
- Rendering Patient ID, description, 1–10 severity scale, and submit control
- Validating required Patient ID and symptom description
- Validating required severity selection (1–10)
- Displaying API success banner and clearing the form after save
- Displaying readable API failure feedback on server/network errors

---

## Sample Patient ID & Demonstration Data

- **Sample Patient ID:** `PATIENT001`
- **Contents:** 7 non-real demonstration symptom entries spanning the last 21 days with severity values ranging from `2` to `8`, including two entries on the same day to demonstrate daily average trend calculation.
- **Isolation Testing:** Use the Patient ID switcher in the top bar (e.g., switch to `PATIENT002`) to verify empty states and patient-isolated logging.

---

## Application Views (Screenshots Overview)

The UI implements five responsive views sharing a persistent sidebar and top patient-switcher bar:

- **Dashboard (`/`)**: Active patient banner (`PATIENT001` clearly marked as sample demonstration data), 4 KPI summary cards (total entries, average severity, peak severity, latest activity), 30-day severity trend chart, and recent symptom activity list.
- **Log Symptoms (`/log`)**: Patient ID field, 500-character symptom description input with live counter, interactive 1–10 severity rating pills (`Mild`, `Moderate`, `High`, `Severe`), duplicate-submit protection, and inline validation + API status feedback.
- **Symptom History (`/history`)**: Chronological ascending symptom table (oldest at top, latest entries at bottom with `Latest` indicator), search filter, readable local dates/times, and loading/empty/error states.
- **Health Analytics (`/analytics`)**: Responsive Recharts 30-day daily average severity line chart with tooltip, grid lines, daily breakdown table, and honest empty-data handling.
- **About HealthTrack (`/about`)**: Severity scale reference, architecture summary, and explicit non-diagnostic medical disclaimer.

---

## Known Limitations

- Authentication and role-based access control are intentionally omitted per assignment scope; patient switching is open for demonstration purposes.
- `GET /api/symptoms/{patientId}/trends` aggregates daily averages in UTC; patients logging late at night in non-UTC timezones may see entries grouped under the corresponding UTC calendar day.
- Symptom entries cannot yet be edited or deleted from the UI (`PUT`/`DELETE` endpoints are not part of the current specification).

---

## Future Improvements

- Add patient authentication (JWT / OAuth2) and clinician shareable summary links (PDF/CSV export).
- Support timezone-aware daily trend grouping based on the patient's selected IANA timezone.
- Add symptom categories/tags, medication correlation notes, and edit/delete actions with audit history.

---

## AI Usage

**Tools Used:** OpenAI ChatGPT and Google Antigravity.

**Parts of Work Assisted:**
- Architecture planning for the layered Spring Boot backend (`controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`) and React frontend (`components`, `pages`, `hooks`, `services`, `utils`).
- Boilerplate and code suggestions for REST endpoints, DTO validation, Recharts 30-day trend visualization, Tailwind CSS UI layout, SQL scripts (`schema.sql`, `data.sql`), automated tests (JUnit 5/Mockito/MockMvc and Vitest/React Testing Library), and README documentation.

**What Was Verified & Modified Afterwards:**
- Removed deprecated explicit `hibernate.dialect` properties from `application.properties` and `application-test.properties` for clean Hibernate 6.6 auto-detection.
- Added `@Check(constraints = "severity >= 1 AND severity <= 10")` on `SymptomLog` and configured optional root `.env` loading (`spring.config.import`) without committing secrets.
- Added and fixed `run-backend.bat` (resolved `cmd.exe` parenthesis escaping) for reliable local Windows startup.
- Verified all 11 backend tests (`mvn test`), all 5 frontend tests (`npm test`), production Vite build (`npm run build`), live MySQL 8.0 persistence (`healthtrack.symptom_logs`), live `POST`/`GET`/`trends` API validation, and live end-to-end browser workflows.
