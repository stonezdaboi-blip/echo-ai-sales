import { Pool } from 'pg';

export interface Pattern {
  type: 'trend' | 'cluster' | 'anomaly';
  name: string;
  strength: number;
  description: string;
  items: string[];
  confidence: number;
}

export class PatternAnalyzer {
  constructor(private db: Pool) {}

  async analyzePatterns(queryId: string): Promise<{
    trends: Pattern[];
    clusters: Pattern[];
    anomalies: Pattern[];
  }> {
    try {
      const data = await this.getResearchData(queryId);

      return {
        trends: this.detectTrends(data),
        clusters: this.detectClusters(data),
        anomalies: this.detectAnomalies(data),
      };
    } catch (error) {
      console.error('Pattern analysis error:', error);
      throw new Error('Failed to analyze patterns');
    }
  }

  private detectTrends(data: any[]): Pattern[] {
    // Analyze temporal patterns in data
    const trends: Pattern[] = [];
    const timeGroups = this.groupByTime(data);

    for (const [period, items] of Object.entries(timeGroups)) {
      const strength = (items as any[]).length / data.length;
      if (strength > 0.2) {
        trends.push({
          type: 'trend',
          name: `Growth in ${period}`,
          strength: Math.min(1, strength),
          description: `${(items as any[]).length} mentions detected`,
          items: (items as any[]).map((i: any) => i.id),
          confidence: 0.85,
        });
      }
    }

    return trends;
  }

  private detectClusters(data: any[]): Pattern[] {
    // Group similar items together
    const clusters: Pattern[] = [];
    const grouped = this.groupBySimilarity(data);

    for (const [clusterName, items] of Object.entries(grouped)) {
      clusters.push({
        type: 'cluster',
        name: clusterName,
        strength: (items as any[]).length / data.length,
        description: `${(items as any[]).length} related items`,
        items: (items as any[]).map((i: any) => i.id),
        confidence: 0.80,
      });
    }

    return clusters;
  }

  private detectAnomalies(data: any[]): Pattern[] {
    // Find unusual or unexpected patterns
    const anomalies: Pattern[] = [];
    const avg = data.length / data.length;

    for (const item of data) {
      if (item.frequency > avg * 2) {
        anomalies.push({
          type: 'anomaly',
          name: `Unusual spike: ${item.name}`,
          strength: Math.min(1, item.frequency / (avg * 3)),
          description: `${item.frequency}x normal frequency`,
          items: [item.id],
          confidence: 0.75,
        });
      }
    }

    return anomalies;
  }

  private groupByTime(data: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};

    for (const item of data) {
      const period = new Date(item.created_at).toLocaleDateString();
      if (!groups[period]) groups[period] = [];
      groups[period].push(item);
    }

    return groups;
  }

  private groupBySimilarity(data: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};

    for (const item of data) {
      const category = item.category || 'uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    }

    return groups;
  }

  private async getResearchData(queryId: string): Promise<any[]> {
    const result = await this.db.query(
      'SELECT * FROM research_content WHERE query_id = $1',
      [queryId]
    );

    return result.rows;
  }
          }
