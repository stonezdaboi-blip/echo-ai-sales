import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Research endpoints
app.post('/api/research', async (req: Request, res: Response) => {
  try {
    const { query, prospects } = req.body;
    
    const result = await pool.query(
      'INSERT INTO research (query, prospects, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [query, JSON.stringify(prospects)]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create research' });
  }
});

app.get('/api/research/:queryId', async (req: Request, res: Response) => {
  try {
    const { queryId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM research WHERE id = $1',
      [queryId]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Research not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch research' });
  }
});

// Search endpoint
app.post('/api/research/:queryId/search', async (req: Request, res: Response) => {
  try {
    const { queryId } = req.params;
    const { query } = req.body;
    
    // Placeholder for semantic search logic
    const results = {
      queryId,
      query,
      results: [],
      quality: 0.85,
      responseTime: 152,
    };
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Pattern analysis endpoint
app.get('/api/research/:queryId/patterns', async (req: Request, res: Response) => {
  try {
    const { queryId } = req.params;
    
    const patterns = {
      trends: [],
      clusters: [],
      anomalies: [],
    };
    
    res.json(patterns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze patterns' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
