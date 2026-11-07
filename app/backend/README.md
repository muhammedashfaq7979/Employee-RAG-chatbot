# ACME PolicyHub - Backend Server & API Guide

Spring Boot 3.3.4 + Spring AI + PostgreSQL (`pgvector` on Port **5433**) + Local Ollama (`llama3.1:8b`).

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Step-by-Step Server Setup](#3-step-by-step-server-setup)
4. [Interactive Swagger API Documentation](#4-interactive-swagger-api-documentation)
5. [Complete REST API Reference](#5-complete-rest-api-reference)
   - [Authentication Module](#authentication-module)
   - [Policy RAG Chat Module](#policy-rag-chat-module)
   - [Document Ingestion Module](#document-ingestion-module)
6. [Pre-Seeded Employee Test Accounts](#6-pre-seeded-employee-test-accounts)
7. [Database & Configuration Details](#7-database--configuration-details)

---

## 1. Architecture Overview

```
                                  HTTP (Port 8000)
                       ┌─────────────────────────────────────┐
                       │  Frontend React App / Swagger UI    │
                       └──────────────────┬──────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Spring Boot 3.3.4 (Java 17/21)                                 │
│                                                                                  │
│   ├── Spring Security (Stateless JWT, BCryptPasswordEncoder)                     │
│   ├── AuthController (/api/auth/register, /login, /refresh, /logout, /me)         │
│   ├── EmployeeController (/api/employees CRUD, HR-only)                          │
│   ├── ChatController (/api/chat, /api/chat/stream SSE)                           │
│   ├── DocumentController (/api/documents/sync-local-docs, /upload)              │
│   ├── DocumentIngestionService (PDFBox / Markdown TokenTextSplitter)             │
│   └── PolicyRagService (Cosine similarity thresholding, strict grounding)       │
└───────────────────────┬──────────────────────────────────┬───────────────────────┘
                        │                                  │
      SQL + Vector(768) │                                  │ REST (Port 11434)
      Port 5433         ▼                                  ▼
 ┌───────────────────────────────┐              ┌───────────────────────────────┐
 │ PostgreSQL 16 + pgvector      │              │ Local Ollama on macOS         │
 │  - users table (BCrypt hash)  │              │  - nomic-embed-text (768d)    │
 │  - employee_balances table    │              │  - llama3.1:8b (Chat LLM)     │
 │  - vector_store (HNSW index)  │              └───────────────────────────────┘
 └───────────────────────────────┘
```

---

## 2. Prerequisites

1. **Docker**: Docker Desktop running on your Mac.
2. **Java JDK**: Java 17 or Java 21 (`java -version`).
3. **Maven**: Maven 3.8+ installed (`mvn -version`).
4. **Ollama**: Running locally with required models pulled:
   ```bash
   ollama pull llama3.1:8b
   ollama pull nomic-embed-text
   ```

---

## 3. Step-by-Step Server Setup

### Step 1: Start PostgreSQL (`pgvector`) on Port 5433
Inside the `app/` folder, run Docker Compose:
```bash
cd app
docker compose up -d
```
Verify the container is healthy and mapped to port `5433`:
```bash
docker ps --filter "name=employee_policy_pgvector"
```
*Note: Port 5433 is mapped to container port 5432 to avoid conflicts with any existing PostgreSQL instance running on default port 5432.*

### Step 2: Build and Run Spring Boot
Navigate to `app/backend` and start the server:
```bash
cd backend
mvn clean spring-boot:run
```
The server will initialize:
- Flyway/DDL and verify connection to `jdbc:postgresql://localhost:5433/policydb`
- Register `vector_store` with 768 dimensions
- Start embedded Tomcat on **`http://localhost:8000`**

---

## 4. Interactive Swagger API Documentation

The backend includes full OpenAPI 3.0 documentation with interactive Swagger UI and JWT Bearer authorization support:

- **Swagger UI Web Interface**: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- **OpenAPI 3.0 JSON Specification**: [http://localhost:8000/v3/api-docs](http://localhost:8000/v3/api-docs)

Swagger UI and the OpenAPI JSON endpoint are controlled together by `app.api-doc-enable` in `src/main/resources/application.yml`. Set it to `true` to enable both endpoints, or `false` to disable both (requests return 404). Restart the backend after changing the value.

### How to use Swagger UI:
1. Open [http://localhost:8000/api-docs](http://localhost:8000/api-docs) in your browser.
2. Under **Authentication**, open `POST /api/auth/login`, click **Try it out**, and submit with Sarah Jenkins' credentials:
   ```json
   {
     "email": "sarah.jenkins@acmecorp.com",
     "password": "password123"
   }
   ```
3. Copy the returned `token` from the response.
4. Click the green **Authorize** button at the top right and paste the access token:
   ```text
   Bearer YOUR_JWT_TOKEN_HERE
   ```
5. Click **Authorize**. Protected employee endpoints can now be executed from Swagger UI.

---

## 5. Complete REST API Reference

### Authentication Module

#### 1. Register Employee
- **Method & Path**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "Alex Rivera",
    "email": "alex.rivera@acmecorp.com",
    "password": "password123",
    "department": "Engineering",
    "role": "ROLE_EMPLOYEE"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "refreshToken": "<opaque refresh token>",
    "expiresIn": 900,
    "user": {
      "id": "b302c11e-c16d-43cc-a163-b6de66804b47",
      "name": "Alex Rivera",
      "email": "alex.rivera@acmecorp.com",
      "role": "ROLE_EMPLOYEE",
      "department": "Engineering",
      "balances": {
        "casualLeave": { "used": 0, "total": 12 },
        "sickLeave": { "used": 0, "total": 10 },
        "earnedLeave": { "used": 0, "total": 15 },
        "homeOfficeClaimed": 0.00,
        "homeOfficeLimit": 500.00,
        "securityScore": 100
      }
    },
    "message": "Registration successful!"
  }
  ```

#### 2. Employee Login
- **Method & Path**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "sarah.jenkins@acmecorp.com",
    "password": "password123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "refreshToken": "<opaque refresh token>",
    "expiresIn": 900,
    "user": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Sarah Jenkins",
      "email": "sarah.jenkins@acmecorp.com",
      "role": "ROLE_EMPLOYEE",
      "department": "Engineering",
      "balances": {
        "casualLeave": { "used": 4, "total": 12 },
        "sickLeave": { "used": 1, "total": 10 },
        "earnedLeave": { "used": 6, "total": 15 },
        "homeOfficeClaimed": 350.00,
        "homeOfficeLimit": 500.00,
        "securityScore": 100
      }
    },
    "message": "Login successful!"
  }
  ```

#### 3. Refresh Access and Refresh Tokens
- **Method & Path**: `POST /api/auth/refresh`
- **Request Body**: `{ "refreshToken": "<refresh token returned by login/register>" }`
- **Response**: A new access token and a rotated refresh token. The previous refresh token is no longer valid.

#### 4. Log Out
- **Method & Path**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer <access-token>`
- **Request Body**: `{ "refreshToken": "<refresh token>" }`
- **Response**: `204 No Content`; the refresh token is revoked.

#### 5. Get Current Authenticated Profile
- **Method & Path**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@acmecorp.com",
    "role": "ROLE_EMPLOYEE",
    "department": "Engineering",
    "balances": { ... }
  }
  ```

---

### Employee Management Module

All employee CRUD routes require an authenticated `ROLE_HR` or `ROLE_ADMIN` account. Employee records have a one-to-one `employeeBalance` association; creating an employee initializes default leave and allowance balances unless values are supplied.

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/employees` | List employees with balances |
| `GET` | `/api/employees/{id}` | Read one employee and balances |
| `POST` | `/api/employees` | Create employee and associated balance |
| `PUT` | `/api/employees/{id}` | Update profile and optionally balances |
| `DELETE` | `/api/employees/{id}` | Delete employee, balances, and refresh tokens |

Example create request:
```json
{
  "name": "Alex Rivera",
  "email": "alex.rivera@acmecorp.com",
  "password": "password123",
  "department": "Engineering",
  "role": "ROLE_EMPLOYEE",
  "balances": {
    "casualLeaveUsed": 0,
    "casualLeaveTotal": 12,
    "sickLeaveUsed": 0,
    "sickLeaveTotal": 10,
    "earnedLeaveUsed": 0,
    "earnedLeaveTotal": 15,
    "homeOfficeClaimed": 0,
    "homeOfficeLimit": 500,
    "securityScore": 100
  }
}
```

Public registration always creates a `ROLE_EMPLOYEE` account; it does not accept a client-supplied role. Employee CRUD currently permits HR and admins to create employee, HR, or security roles. Promote an initial admin directly in the database if required:
```sql
UPDATE users SET role = 'ROLE_ADMIN' WHERE email = 'admin@example.com';
```

---

### Policy RAG Chat Module

#### 1. Ask Policy Question (Synchronous with Citations)
- **Method & Path**: `POST /api/chat`
- **Request Body**:
  ```json
  {
    "query": "How many days of sick leave can I carry forward to next year?",
    "topK": 4,
    "similarityThreshold": 0.65
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "answer": "According to the HR Leave Policy 2024 (Section 2.2), you are entitled to 10 days of Sick Leave per calendar year. A maximum of 5 unused Sick Leave days can be carried forward to the next calendar year.",
    "citations": [
      {
        "sourceFile": "HR_Leave_Policy_2024.md",
        "pageNumber": 2,
        "excerpt": "A maximum of 5 unused Sick Leave days can be carried forward to the next calendar year."
      }
    ],
    "foundInPolicies": true
  }
  ```

#### 2. Stream Policy Answer (Server-Sent Events)
- **Method & Path**: `GET /api/chat/stream?query=What+are+the+password+requirements%3F`
- **Headers**: `Accept: text/event-stream`
- **Response**: Incremental token stream delivered in real-time.

---

### Document Ingestion Module

#### 1. Sync All Local Policy Documents
- **Method & Path**: `POST /api/documents/sync-local-docs`
- **Query Parameter**: `path` (default: `docs`)
- **cURL Command**:
  ```bash
  curl -X POST "http://localhost:8000/api/documents/sync-local-docs"
  ```
- **Response** (`200 OK`):
  ```json
  {
    "status": "completed",
    "folder": "docs",
    "total_chunks_indexed": 6,
    "file_breakdown": {
      "HR_Leave_Policy_2024.md": 3,
      "IT_Security_and_Remote_Work_Policy.md": 3
    }
  }
  ```

#### 2. Upload Individual Policy Document
- **Method & Path**: `POST /api/documents/upload`
- **Content-Type**: `multipart/form-data`
- **Form Param**: `file` (PDF, Markdown, or TXT file)

---

## 6. Pre-Seeded Employee Test Accounts

All pre-seeded test accounts use the password: **`password123`**

| Employee Name | Email Address | Department | Role | Quotas |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | `sarah.jenkins@acmecorp.com` | Engineering | `ROLE_EMPLOYEE` | 8/12 CL, 9/10 SL, $150 remaining allowance |
| **Marcus Vance** | `marcus.vance@acmecorp.com` | People Operations | `ROLE_HR` | 10/12 CL, 10/10 SL, $0 remaining allowance |
| **David Chen** | `david.chen@acmecorp.com` | Security | `ROLE_SECURITY` | 9/12 CL, 8/10 SL, $280 remaining allowance |

---

## 7. Database & Configuration Details

### Configuration (`src/main/resources/application.yml`):
```yaml
server:
  port: 8000

spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/policydb
    username: postgres
    password: postgrespassword

  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: llama3.1:8b
          temperature: 0.1
      embedding:
        options:
          model: nomic-embed-text
    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: COSINE_DISTANCE
        dimensions: 768
```

### Useful Commands:
- **Inspect PostgreSQL Tables**:
  ```bash
  docker exec -it employee_policy_pgvector psql -U postgres -d policydb
  ```
- **List All Users**:
  ```sql
  SELECT id, name, email, role, department FROM users;
  ```
- **Check Stored Policy Vectors**:
  ```sql
  SELECT id, metadata->>'source_file' AS file, metadata->>'page_number' AS page FROM vector_store;
  ```
