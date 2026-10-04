export interface Research {
  id: string;
  query: string;
  prospects: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: Date;
  updated_at: Date;
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
  type: 'new' | 'updated' | 'removed' | 'escalated';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface SearchStats {
  totalSearches: number;
  avgResponseTime: number;
  avgQuality: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  }
