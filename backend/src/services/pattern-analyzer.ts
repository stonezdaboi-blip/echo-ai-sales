import { Pool } from 'pg';

export interface Pattern {
  type: string;
  name: string;
  strength: number;
  description: string;
  items: unknown[];
}

interface ResearchData {
  id: string;
  content: string;
  source?: string | null;
  frequency?: number | null;
  metadata?: Record<string, unknown> | null;
}

export class PatternAnalyzer {
  constructor(private readonly db: Pool) {}

  async analyzePatterns(queryId: string) {
    const data = await this.getResearchData(queryId);

    return {
      trends: this.detectTrends(data),
      clusters: this.detectClusters(data),
      anomalies: this.detectAnomalies(data),
    };
  }

  private detectTrends(data: ResearchData[]): Pattern[] {
    if (data.length === 0) {
      return [];
    }

    const sourceCounts = new Map<string, number>();

    for (const item of data) {
      const source = item.source || 'Unknown';

      sourceCounts.set(
        source,
        (sourceCounts.get(source) || 0) + 1
      );
    }

    return Array.from(sourceCounts.entries())
      .filter(([, count]) => count >= 2)
      .map(([source, count]) => ({
        type: 'trend',
        name: `${source} activity`,
        strength: Math.min(1, count / data.length),
        description: `${count} research items are associated with ${source}.`,
        items: data
          .filter((item) => (item.source || 'Unknown') === source)
          .map((item) => item.id),
      }));
  }

  private detectClusters(data: ResearchData[]): Pattern[] {
    const clusters = new Map<string, ResearchData[]>();

    for (const item of data) {
      const source = item.source || 'Unknown';

      if (!clusters.has(source)) {
        clusters.set(source, []);
      }

      clusters.get(source)!.push(item);
    }

    return Array.from(clusters.entries())
      .filter(([, items]) => items.length >= 2)
      .map(([source, items]) => ({
        type: 'cluster',
        name: `${source} cluster`,
        strength: Math.min(1, items.length / Math.max(data.length, 1)),
        description: `Related research content grouped by source: ${source}.`,
        items: items.map((item) => item.id),
      }));
  }

  private detectAnomalies(data: ResearchData[]): Pattern[] {
    if (data.length < 2) {
      return [];
    }

    const frequencies = data.map((item) => {
      const frequency = Number(item.frequency);

      return Number.isFinite(frequency) && frequency > 0
        ? frequency
        : 1;
    });

    const average =
      frequencies.reduce((sum, value) => sum + value, 0) /
      frequencies.length;

    const threshold = average * 2;

    return data
      .map((item, index) => ({
        item,
        frequency: frequencies[index],
      }))
      .filter(({ frequency }) => frequency > threshold)
      .map(({ item, frequency }) => ({
        type: 'anomaly',
        name: 'Unusual activity',
        strength: Math.min(1, frequency / (threshold || 1)),
        description: `Research item frequency (${frequency}) is significantly above the average (${average.toFixed(
          2
        )}).`,
        items: [item.id],
      }));
  }

  private async getResearchData(
    queryId: string
  ): Promise<ResearchData[]> {
    const result = await this.db.query(
      `
      SELECT
        id,
        content,
        source,
        metadata
      FROM research_content
      WHERE query_id = $1
      ORDER BY created_at DESC
      `,
      [queryId]
    );

    return result.rows.map((row) => ({
      ...row,
      frequency:
        typeof row.metadata?.frequency === 'number'
          ? row.metadata.frequency
          : 1,
    }));
  }
      }
