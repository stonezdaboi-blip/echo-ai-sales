import express, { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { SemanticSearcher } from '../services/semantic-searcher';
import { PatternAnalyzer } from '../services/pattern-analyzer';

export function createResearchRoutes(
  db: Pool,
  openaiKey: string
): Router {
  const router = express.Router();

  const searcher = new SemanticSearcher(db, openaiKey);
  const analyzer = new PatternAnalyzer(db);

  // Get all researches
  router.get('/researches', async (_req: Request, res: Response) => {
    try {
      const result = await db.query(
        `
        SELECT *
        FROM research
        ORDER BY created_at DESC
        LIMIT 50
        `
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Failed to fetch researches:', error);

      res.status(500).json({
        error: 'Failed to fetch researches',
      });
    }
  });

  // Create research
  router.post('/research', async (req: Request, res: Response) => {
    try {
      const { query, prospects = [] } = req.body;

      if (!query || typeof query !== 'string' || !query.trim()) {
        res.status(400).json({
          error: 'A research query is required',
        });
        return;
      }

      const result = await db.query(
        `
        INSERT INTO research (
          query,
          prospects,
          status
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
          query.trim(),
          JSON.stringify(prospects),
          'pending',
        ]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Failed to create research:', error);

      res.status(500).json({
        error: 'Failed to create research',
      });
    }
  });

  // Get research by ID
  router.get(
    '/research/:queryId',
    async (req: Request, res: Response) => {
      try {
        const { queryId } = req.params;

        const result = await db.query(
          `
          SELECT *
          FROM research
          WHERE id = $1
          `,
          [queryId]
        );

        if (result.rows.length === 0) {
          res.status(404).json({
            error: 'Research not found',
          });
          return;
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error('Failed to fetch research:', error);

        res.status(500).json({
          error: 'Failed to fetch research',
        });
      }
    }
  );

  // Search within research
  router.post(
    '/research/:queryId/search',
    async (req: Request, res: Response) => {
      try {
        const { queryId } = req.params;
        const { query } = req.body;

        if (!query || typeof query !== 'string' || !query.trim()) {
          res.status(400).json({
            error: 'A search query is required',
          });
          return;
        }

        const research = await db.query(
          `
          SELECT id
          FROM research
          WHERE id = $1
          `,
          [queryId]
        );

        if (research.rows.length === 0) {
          res.status(404).json({
            error: 'Research not found',
          });
          return;
        }

        const startTime = Date.now();

        const results = await searcher.search(
          query.trim(),
          10
        );

        const responseTime = Date.now() - startTime;

        res.json({
          queryId,
          query: query.trim(),
          results,
          quality: results.length > 0 ? 0.85 : 0,
          responseTime,
        });
      } catch (error) {
        console.error('Search failed:', error);

        res.status(500).json({
          error: 'Search failed',
        });
      }
    }
  );

  // Get patterns
  router.get(
    '/research/:queryId/patterns',
    async (req: Request, res: Response) => {
      try {
        const { queryId } = req.params;

        const research = await db.query(
          `
          SELECT id
          FROM research
          WHERE id = $1
          `,
          [queryId]
        );

        if (research.rows.length === 0) {
          res.status(404).json({
            error: 'Research not found',
          });
          return;
        }

        const patterns = await analyzer.analyzePatterns(
          queryId
        );

        res.json(patterns);
      } catch (error) {
        console.error('Failed to analyze patterns:', error);

        res.status(500).json({
          error: 'Failed to analyze patterns',
        });
      }
    }
  );

  // Get alerts
  router.get(
    '/research/:queryId/alerts',
    async (req: Request, res: Response) => {
      try {
        const { queryId } = req.params;

        const result = await db.query(
          `
          SELECT *
          FROM changes
          WHERE query_id = $1
            AND type IN ('new', 'escalated')
          ORDER BY created_at DESC
          LIMIT 20
          `,
          [queryId]
        );

        res.json(result.rows);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);

        res.status(500).json({
          error: 'Failed to fetch alerts',
        });
      }
    }
  );

  // Update research status
  router.patch(
    '/research/:queryId',
    async (req: Request, res: Response) => {
      try {
        const { queryId } = req.params;
        const { status } = req.body;

        if (!status || typeof status !== 'string') {
          res.status(400).json({
            error: 'A status is required',
          });
          return;
        }

        const result = await db.query(
          `
          UPDATE research
          SET
            status = $1,
            updated_at = NOW()
          WHERE id = $2
          RETURNING *
          `,
          [status, queryId]
        );

        if (result.rows.length === 0) {
          res.status(404).json({
            error: 'Research not found',
          });
          return;
        }

        res.json(result.rows[0]);
      } catch (error) {
        console.error('Failed to update research:', error);

        res.status(500).json({
          error: 'Failed to update research',
        });
      }
    }
  );

  return router;
            }
