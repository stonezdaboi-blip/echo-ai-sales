// Research Status
export const RESEARCH_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Pattern Types
export const PATTERN_TYPES = {
  TREND: 'trend',
  CLUSTER: 'cluster',
  ANOMALY: 'anomaly',
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Search Quality Thresholds
export const SEARCH_QUALITY = {
  EXCELLENT: 0.85,
  GOOD: 0.70,
  FAIR: 0.50,
  POOR: 0.30,
} as const;

// API Response Codes
export const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 5,
} as const;

// Cache TTL (seconds)
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 1 day
} as const;
