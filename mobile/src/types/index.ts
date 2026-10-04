export interface Research {
  id: string;
  query: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  results_count: number;
}

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  relevance: number;
  confidence: number;
  source: string;
}

export interface Pattern {
  id: string;
  type: 'trend' | 'cluster' | 'anomaly';
  name: string;
  strength: number;
  description: string;
  items: string[];
  confidence: number;
}

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
