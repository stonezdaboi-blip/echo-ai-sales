-- ECHO 1.0 - Initial PostgreSQL Database Schema

-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- =========================================================
-- RESEARCH
-- =========================================================

CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  prospects JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_research_query
  ON research(query);

CREATE INDEX IF NOT EXISTS idx_research_status
  ON research(status);

-- =========================================================
-- RESEARCH CONTENT
-- =========================================================

CREATE TABLE IF NOT EXISTS research_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  source VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_research_content_query_id
  ON research_content(query_id);

CREATE INDEX IF NOT EXISTS idx_research_content_source
  ON research_content(source);

-- Vector similarity index
CREATE INDEX IF NOT EXISTS idx_research_content_embedding
  ON research_content
  USING ivfflat (embedding vector_cosine_ops);

-- =========================================================
-- SEARCH RESULTS
-- =========================================================

CREATE TABLE IF NOT EXISTS search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results JSONB,
  quality_score DECIMAL(3,2),
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_results_research_id
  ON search_results(research_id);

-- =========================================================
-- PATTERNS
-- =========================================================
-- The complete patterns structure is handled by
-- 002_create_patterns_schema.sql.
-- It is intentionally NOT created here to avoid
-- conflicting definitions across migrations.
