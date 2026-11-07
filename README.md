# Employee Policy RAG Assistant (Java Spring Boot + pgvector + Local Ollama)

An enterprise-ready, privacy-first Retrieval-Augmented Generation (RAG) assistant for internal employee policies, running 100% locally on macOS with zero external API calls.

---

## 🏗 Architecture
- **Backend**: Java 17/21 + Spring Boot 3.3 + Spring AI
- **Vector Database**: PostgreSQL 16 with `pgvector` (HNSW cosine similarity index)
- **Local AI (Ollama on Mac)**:
  - LLM: `llama3.1:8b` (Chat completion & grounded reasoning)
  - Embeddings: `nomic-embed-text` (768 dimensions, 8,192 token context)
- **Document Support**: PDF, Markdown (`.md`), and plain text (`.txt`)

---

## 🚀 Quickstart Guide

### 1. Prerequisites on Mac
1. **Ollama**: Ensure [Ollama](https://ollama.com) is running locally. Pull the required models:
   ```bash
   ollama pull llama3.1:8b
   ollama pull nomic-embed-text
   ```
2. **Docker**: Ensure Docker Desktop is installed and running.
3. **Java**: JDK 17 or JDK 21 installed (`java -version`).
4. **Maven**: Maven 3.8+ installed (`mvn -version`).

---

### 2. Start PostgreSQL with pgvector
Run Docker Compose in the project root:
```bash
docker compose up -d
```
Verify the container is healthy:
```bash
docker ps
```
*(The `docker/init.sql` script automatically enables the `vector` extension and creates the 768-dimensional `vector_store` table).*

---

### 3. Start the Spring Boot Application
Run the backend using Maven:
```bash
mvn clean spring-boot:run
```
The backend server will start on port `8000`.

---

### 4. Index the Policy Documents
We have included sample policies in the `docs/` folder:
- [HR_Leave_Policy_2024.md](file:///Users/apple/Desktop/AI/Projects/Employee%20policy/docs/HR_Leave_Policy_2024.md)
- [IT_Security_and_Remote_Work_Policy.md](file:///Users/apple/Desktop/AI/Projects/Employee%20policy/docs/IT_Security_and_Remote_Work_Policy.md)

Trigger the indexing endpoint to chunk and embed these documents into `pgvector`:
```bash
curl -X POST "http://localhost:8000/api/documents/sync-local-docs"
```
**Expected Response:**
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

---

### 5. Test Asking Questions

#### Test 1: Standard Question with Source Citations
```bash
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{
       "query": "How many days of casual leave do I get, and can I carry them over?",
       "similarityThreshold": 0.5,
       "topK": 4
     }'
```
`similarityThreshold` sets the minimum vector similarity for a retrieved chunk to be considered; `topK` limits the number of unique chunks included in the answer context. If omitted, the defaults are `0.40` and `4`, respectively.
**Sample Response:**
```json
{
  "answer": "According to the HR Leave Policy 2024 (Section 2.1), full-time employees are entitled to 12 days of Casual Leave (CL) per calendar year, accrued at 1 day per month. Unused Casual Leave lapses at the end of each calendar year (December 31st) and cannot be carried over or encashed.",
  "citations": [
    {
      "sourceFile": "HR_Leave_Policy_2024.md",
      "pageNumber": 1,
      "excerpt": "### 2.1 Casual Leave (CL)\n- **Entitlement**: 12 days per calendar year..."
    }
  ],
  "foundInPolicies": true
}
```

#### Test 2: Anti-Hallucination Fallback Test
Ask a question about something not in the company documents:
```bash
curl -X POST "http://localhost:8000/api/chat" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is the annual stock grant schedule for engineering managers?"}'
```
**Response:**
```json
{
  "answer": "I cannot find this information in the official policy documents. Please contact HR or IT directly.",
  "citations": [],
  "foundInPolicies": false
}
```

#### Test 3: Real-Time Token Streaming (SSE)
```bash
curl -N "http://localhost:8000/api/chat/stream?query=What+are+the+password+requirements+under+IT+security%3F"
```

### Retrieval and duplicate handling
The chat service removes duplicate policy chunks before sending context to the language model. It identifies chunks by their `chunk_id` metadata, falling back to the chunk content when that metadata is unavailable. This helps keep repeated copies from crowding out distinct policy excerpts.

For `POST /api/chat`, the service searches for at least 8 candidate chunks (or twice the requested `topK`, whichever is larger), then includes at most `topK` unique chunks. The streaming endpoint uses a fixed search of 8 candidates and includes at most 4 unique chunks.

---

## 📁 Project Structure

```plaintext
├── docker-compose.yml              # PostgreSQL + pgvector container definition
├── docker/
│   └── init.sql                   # pgvector extension & HNSW table schema
├── docs/                          # Source policy documents (Markdown/PDF)
│   ├── HR_Leave_Policy_2024.md
│   └── IT_Security_and_Remote_Work_Policy.md
├── pom.xml                        # Maven dependencies (Spring Boot + Spring AI)
├── PROJECT_PLAN.md                # Comprehensive Architecture & Roadmap
└── src/
    └── main/
        ├── java/com/company/policyrag/
        │   ├── PolicyRagApplication.java
        │   ├── controller/
        │   │   ├── ChatController.java       # Chat & SSE streaming APIs
        │   │   └── DocumentController.java   # Document ingestion APIs
        │   ├── dto/
        │   │   ├── ChatRequest.java
        │   │   └── ChatResponse.java
        │   └── service/
        │       ├── DocumentIngestionService.java # Chunker & vectorizer
        │       └── PolicyRagService.java         # RAG retrieval & LLM caller
        └── resources/
            └── application.yml            # Database & Ollama configuration
```
