import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';

import { createResearchRoutes } from './routes/research-routes';

dotenv.config();

const app: Express = express();

const PORT = Number(process.env.PORT) || 3000;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not configured.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

app.use(cors());

app.use(express.json({ limit: '2mb' }));

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

/**
 * Health check
 */
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Research API
 *
 * All research-related endpoints live in research-routes.ts.
 */
const openaiKey = process.env.OPENAI_API_KEY || '';

app.use('/api', createResearchRoutes(pool, openaiKey));

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
  });
});

/**
 * Global error handler
 */
app.use(
  (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error('Unhandled API error:', error);

    res.status(500).json({
      error: 'Internal Server Error',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred.'
          : error.message,
    });
  }
);

/**
 * Graceful shutdown
 */
const shutdown = async () => {
  console.log('Shutting down ECHO API...');

  await pool.end();

  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

app.listen(PORT, () => {
  console.log(`ECHO API running on port ${PORT}`);
});

export { app, pool };
export default app;
