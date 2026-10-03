-- Create research table
CREATE TABLE IF NOT EXISTS research (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  prospects JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query (query),
  INDEX idx_status (status)
);

-- Create research_content table with pgvector support
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS research_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  source VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query_id (query_id),
  INDEX idx_source (source)
);

-- Create search_results table
CREATE TABLE IF NOT EXISTS search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  results JSONB,
  quality_score DECIMAL(3,2),
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patterns table
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50),
  name TEXT,
  strength DECIMAL(3,2),
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_research_content_embedding ON research_content USING ivfflat (embedding vector_cosine_ops);
