# Master Project Plan: Local Employee Policy RAG Chatbot

## 1. Executive Summary & Core Architecture
This project is an **enterprise-grade, privacy-first Retrieval-Augmented Generation (RAG) assistant** designed for querying internal corporate policies (HR leave, IT security, health benefits, expense policies).

### Architecture Highlights:
- **Backend**: **Java Spring Boot 3.x** leveraging **Spring AI** (or LangChain4j).
- **Vector Database**: **PostgreSQL with `pgvector`** for relational data + high-performance vector similarity search.
- **Local AI Engine**: **Ollama** running locally on macOS (Metal accelerated).
  - Generation: `llama3.1:8b` (or `llama3.2:3b` for 8GB Mac / `qwen2.5:7b`).
  - Embeddings: `nomic-embed-text` (768 dimensions) via Ollama.
- **Frontend**: Clean modern React chat UI with source citation badges and document management.

```
       ┌────────────────────────────────────────────────────────┐
       │                       React UI                         │
       └──────────────────────────┬─────────────────────────────┘
                                  │ REST / SSE Streaming
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Java Spring Boot 3.x (Spring AI)                     │
│                                                                        │
│  ┌───────────────────────┐         ┌────────────────────────────────┐  │
│  │ Document Ingestion    │         │  RAG Orchestrator / Advisor    │  │
│  │  - Apache PDFBox/Tika │         │  - VectorStore.similaritySearch│  │
│  │  - TokenTextSplitter  │         │  - Strict Grounding Prompt     │  │
│  └───────────┬───────────┘         └───────────────┬────────────────┘  │
└──────────────┼─────────────────────────────────────┼───────────────────┘
               │                                     │
       Embeddings & Documents                Query & Top-K Chunks
               │                                     │
               ▼                                     ▼
 ┌───────────────────────────┐         ┌───────────────────────────┐
 │ PostgreSQL + pgvector     │         │ Ollama (Local macOS Metal)│
 │  - vector_store table     │         │  - nomic-embed-text (768d)│
 │  - HNSW index (Cosine)    │         │  - llama3.1:8b (Chat)     │
 │  - JSONB metadata payload │         └───────────────────────────┘
 └───────────────────────────┘
```

---

## 2. Updated Tech Stack

| Layer | Technology | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend** | **Java 17 or 21 + Spring Boot 3.x** | `spring-boot-starter-web` (or `webflux`) | Enterprise REST API, dependency injection, business logic |
| **AI Framework** | **Spring AI** | `spring-ai-ollama-spring-boot-starter`<br>`spring-ai-pgvector-store-spring-boot-starter` | Native Spring integration for Ollama LLM, embeddings, and PgVectorStore |
| **Vector DB** | **PostgreSQL + pgvector** | `pgvector/pgvector:pg16` (Docker or local) | Storing text embeddings (768d) alongside document metadata with HNSW indexing |
| **Local LLM** | **Ollama** | Local daemon on `http://localhost:11434` | Zero-cloud-cost inference on Apple Silicon |
| **Embeddings** | `nomic-embed-text` | 768 dimensions, 8192 context | Vectorizing user queries and policy document chunks |
| **Doc Extraction** | **Apache Tika / PDFBox** | Spring AI `PagePdfDocumentReader` / Tika | Extracting text with page numbers and section headers |
| **Database ORM** | **Spring Data JPA / JdbcClient** | PostgreSQL JDBC Driver | Managing standard tables (chat history, feedback, doc tracking) |
| **Frontend** | **React (Vite) + Tailwind CSS** | TypeScript | Responsive chat, streaming response, citation preview |

---

## 3. What to Focus on in this Java + pgvector RAG Pipeline

### A. Matching Embedding Dimensions with pgvector
- `nomic-embed-text` outputs **768-dimensional** vectors.
- Your PostgreSQL table must be configured with matching dimension:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

  CREATE TABLE IF NOT EXISTS vector_store (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      content TEXT NOT NULL,
      metadata JSONB,
      embedding VECTOR(768)
  );

  -- HNSW index for ultra-fast approximate nearest neighbor search
  CREATE INDEX IF NOT EXISTS vector_store_hnsw_idx 
  ON vector_store USING hnsw (embedding vector_cosine_ops);
  ```

### B. Accurate Page & Section Metadata Extraction
- In corporate policies, a vague answer without a verified citation is risky.
- Use Spring AI's `PagePdfDocumentReader` to split documents page-by-page.
- Metadata to persist in PostgreSQL `metadata` JSONB column:
  ```json
  {
    "source_file": "Leave_Policy_2024.pdf",
    "page_number": 4,
    "department": "HR",
    "section": "Casual Leave Policy",
    "chunk_id": "doc_01_p4_c1"
  }
  ```

### C. Chunking Strategy for Policy Documents
- Policies contain numbered lists, definitions, and clauses.
- Use Spring AI's `TokenTextSplitter(800, 350, 10, 1000, true)` or custom semantic chunker:
  - Target: **400–600 tokens** per chunk.
  - Overlap: **80–120 tokens** to prevent losing cross-sentence clauses.

### D. Strict Anti-Hallucination Prompting & Similarity Filtering
- Configure similarity threshold in Spring AI:
  ```java
  SearchRequest searchRequest = SearchRequest.query(userQuery)
      .withTopK(4)
      .withSimilarityThreshold(0.70); // Discard low-relevance chunks
  ```
- If no chunks pass the threshold, skip Ollama LLM call entirely and immediately return:
  > *"I could not find relevant policy documents regarding your question. Please consult HR directly."*
- System Prompt Template:
  ```text
  You are an official employee policy assistant.
  Answer the employee's question ONLY using the factual context excerpts provided below.
  If the context does not contain the answer, say "This information is not covered in the employee policy documents."
  Never make assumptions or extrapolate beyond the text.
  For each statement, cite the document name and page number.

  [CONTEXT]:
  {context}

  [QUESTION]:
  {question}
  ```

### E. Reactive Streaming via Server-Sent Events (SSE)
- Local models on Apple Silicon typically produce 25–60 tokens/sec.
- Instead of blocking the HTTP request until completion, expose a reactive endpoint:
  ```java
  @GetMapping(value = "/api/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public Flux<String> streamChat(@RequestParam String question) { ... }
  ```
- This delivers instant perceived responsiveness to users.

---

## 4. Spring AI Configuration (`application.yml`)

```yaml
spring:
  application:
    name: employee-policy-rag
  datasource:
    url: jdbc:postgresql://localhost:5432/policydb
    username: postgres
    password: postgrespassword
  ai:
    ollama:
      base-url: http://localhost:11434
      chat:
        options:
          model: llama3.1:8b
          temperature: 0.1 # Low temperature for factual compliance
      embedding:
        options:
          model: nomic-embed-text
    vectorstore:
      pgvector:
        index-type: HNSW
        distance-type: COSINE_DISTANCE
        dimensions: 768
        initialize-schema: true
```

---

## 5. Phased Implementation Roadmap

### Phase 1: Infrastructure & Project Skeleton (Days 1–3)
- [ ] Spin up PostgreSQL with `pgvector` extension (via `docker-compose.yml`).
- [ ] Ensure Ollama has `llama3.1:8b` and `nomic-embed-text` installed.
- [ ] Initialize Spring Boot 3.x project with Maven/Gradle (`spring-ai-ollama-spring-boot-starter`, `spring-ai-pgvector-store-spring-boot-starter`).

### Phase 2: Document Ingestion Pipeline (Days 4–7)
- [ ] Implement `PolicyIngestionService.java`:
  - Read PDFs using `PagePdfDocumentReader`.
  - Extract page numbers and document names into metadata map.
  - Apply `TokenTextSplitter`.
  - Save embeddings directly into `vector_store` table via `PgVectorStore`.
- [ ] Add CLI or REST runner to index sample policy PDFs.

### Phase 3: RAG Service & Streaming (Days 8–12)
- [ ] Implement `PolicyRagService.java`:
  - Hybrid retrieval / similarity search with top-K=4 and score cutoff.
  - Construct prompt injecting context and metadata.
  - Call `OllamaChatModel.stream(...)`.
- [ ] Implement `ChatController.java` with Server-Sent Events (`Flux<ServerSentEvent<String>>`).
- [ ] Format output to include citation metadata (Doc name, page number).

### Phase 4: Frontend & Feedback (Days 13–18)
- [ ] React frontend with:
  - Clean message thread with streaming markdown.
  - Collapsible source citation drawer ("*Verified from: Leave_Policy.pdf, Page 4*").
  - Document upload portal with indexing status indicator.
  - Thumbs up/down feedback logging into PostgreSQL.

---

## 6. Directory Structure (Spring Boot Project)

```plaintext
employee-policy/
├── docker/
│   └── docker-compose.yml         # PostgreSQL + pgvector service
├── docs/                          # Sample PDF policies
│   ├── HR_Leave_Policy_2024.pdf
│   └── Code_of_Conduct.pdf
├── src/
│   ├── main/
│   │   ├── java/com/company/policyrag/
│   │   │   ├── PolicyRagApplication.java
│   │   │   ├── config/
│   │   │   │   └── VectorStoreConfig.java
│   │   │   ├── controller/
│   │   │   │   ├── ChatController.java       # SSE streaming chat
│   │   │   │   └── DocumentController.java   # Document upload & reindexing
│   │   │   ├── dto/
│   │   │   │   ├── ChatRequest.java
│   │   │   │   └── ChatResponse.java
│   │   │   ├── model/
│   │   │   │   └── FeedbackEntity.java
│   │   │   ├── service/
│   │   │   │   ├── DocumentIngestionService.java
│   │   │   │   └── PolicyRagService.java
│   │   │   └── repository/
│   │   │       └── FeedbackRepository.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── schema.sql         # Optional custom pgvector schema
├── frontend/                      # React UI
├── pom.xml (or build.gradle)      # Dependencies
├── PROJECT_PLAN.md                # Master reference plan
└── README.md
```
