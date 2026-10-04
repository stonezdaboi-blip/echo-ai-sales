import { Pool } from 'pg';

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export class AnalyticsService {
  constructor(private db: Pool) {}

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO analytics_events (event_type, user_id, properties, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [event.eventType, event.userId, JSON.stringify(event.properties || {})]
      );
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }

  async trackSearch(userId: string, query: string, resultsCount: number): Promise<void> {
    await this.trackEvent({
      eventType: 'search',
      userId,
      properties: { query, resultsCount },
    });
  }

  async trackResearch(userId: string, queryId: string): Promise<void> {
    await this.trackEvent({
      eventType: 'research_created',
      userId,
      properties: { queryId },
    });
  }

  async trackPatternDetected(userId: string, patternType: string): Promise<void> {
    await this.trackEvent({
      eventType: 'pattern_detected',
      userId,
      properties: { patternType },
    });
  }

  async getEventStats(days: number = 7): Promise<any> {
    const result = await this.db.query(
      `SELECT 
        event_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
       FROM analytics_events
       WHERE created_at > NOW() - INTERVAL '${days} days'
       GROUP BY event_type`
    );

    return result.rows;
  }
  }
