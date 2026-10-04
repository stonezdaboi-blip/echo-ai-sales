-- Create patterns table
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50) NOT NULL,
  name TEXT NOT NULL,
  strength DECIMAL(3,2),
  description TEXT,
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_research_id (research_id),
  INDEX idx_pattern_type (pattern_type)
);

-- Create changes tracking table
CREATE TABLE IF NOT EXISTS changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title TEXT NOT NULL,
  description TEXT,
  severity VARCHAR(20),
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query_id (query_id),
  INDEX idx_type (type)
);

-- Create research snapshots table
CREATE TABLE IF NOT EXISTS research_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_query_id (query_id)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  alert_type VARCHAR(50),
  title TEXT,
  description TEXT,
  severity VARCHAR(20),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_research_id (research_id),
  INDEX idx_alert_type (alert_type)
);
