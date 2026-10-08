-- ECHO 1.0 - Patterns, Changes, Snapshots and Alerts

CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  pattern_type VARCHAR(50) NOT NULL,
  name TEXT NOT NULL,
  strength DECIMAL(3,2),
  description TEXT,
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_patterns_research_id
  ON patterns(research_id);

CREATE INDEX IF NOT EXISTS idx_patterns_pattern_type
  ON patterns(pattern_type);


CREATE TABLE IF NOT EXISTS changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  type VARCHAR(50),
  title TEXT NOT NULL,
  description TEXT,
  severity VARCHAR(20),
  data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_changes_query_id
  ON changes(query_id);

CREATE INDEX IF NOT EXISTS idx_changes_type
  ON changes(type);


CREATE TABLE IF NOT EXISTS research_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES research(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_research_snapshots_query_id
  ON research_snapshots(query_id);


CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  research_id UUID REFERENCES research(id) ON DELETE CASCADE,
  alert_type VARCHAR(50),
  title TEXT,
  description TEXT,
  severity VARCHAR(20),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_research_id
  ON alerts(research_id);

CREATE INDEX IF NOT EXISTS idx_alerts_alert_type
  ON alerts(alert_type);
