-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_EMPLOYEE',
    department VARCHAR(100) NOT NULL DEFAULT 'Engineering',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Quotas & Balances Table
CREATE TABLE IF NOT EXISTS employee_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    casual_leave_used INT DEFAULT 0,
    casual_leave_total INT DEFAULT 12,
    sick_leave_used INT DEFAULT 0,
    sick_leave_total INT DEFAULT 10,
    earned_leave_used INT DEFAULT 0,
    earned_leave_total INT DEFAULT 15,
    home_office_claimed NUMERIC(10, 2) DEFAULT 0.00,
    home_office_limit NUMERIC(10, 2) DEFAULT 500.00,
    security_score INT DEFAULT 100,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spring AI pgvector Vector Store Table (768 dimensions for nomic-embed-text)
CREATE TABLE IF NOT EXISTS vector_store (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768)
);

-- Fast Approximate Nearest Neighbor Index for Cosine Distance
CREATE INDEX IF NOT EXISTS vector_store_hnsw_idx 
ON vector_store USING hnsw (embedding vector_cosine_ops);

-- Seed initial test employees (Password for all three accounts: password123)
-- BCrypt hash for 'password123': $2a$10$1r2w6zC3G8sN0mQ9W3z2reV1bK5j4f3g2d1s0a9b8c7d6e5f4g3h2
-- Standard BCrypt hash: $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi
INSERT INTO users (id, name, email, password_hash, role, department)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Sarah Jenkins', 'sarah.jenkins@acmecorp.com', '$2a$10$JvNjqaUy3.p3ycf/HRxIROt6BIyFhzr3ais7wQs035aPS2FlVBgTW', 'ROLE_EMPLOYEE', 'Engineering'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Marcus Vance', 'marcus.vance@acmecorp.com', '$2a$10$JvNjqaUy3.p3ycf/HRxIROt6BIyFhzr3ais7wQs035aPS2FlVBgTW', 'ROLE_HR', 'People Operations'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'David Chen', 'david.chen@acmecorp.com', '$2a$10$JvNjqaUy3.p3ycf/HRxIROt6BIyFhzr3ais7wQs035aPS2FlVBgTW', 'ROLE_SECURITY', 'Security')
ON CONFLICT (email) DO NOTHING;

-- Seed balances for test employees
INSERT INTO employee_balances (user_id, casual_leave_used, casual_leave_total, sick_leave_used, sick_leave_total, earned_leave_used, earned_leave_total, home_office_claimed, home_office_limit, security_score)
VALUES
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 4, 12, 1, 10, 6, 15, 350.00, 500.00, 100),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 2, 12, 0, 10, 8, 15, 500.00, 500.00, 98),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 3, 12, 2, 10, 5, 15, 220.00, 500.00, 100)
ON CONFLICT (user_id) DO NOTHING;
