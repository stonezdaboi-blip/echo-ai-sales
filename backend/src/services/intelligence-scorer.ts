import { Pool } from 'pg';

export interface ScoredIntelligence {
  id: string;
  score: number;
  factors: {
    relevance: number;
    recency: number;
    quality: number;
    uniqueness: number;
  };
}

export class IntelligenceScorer {
  constructor(private db: Pool) {}

  async scoreIntelligence(contentId: string): Promise<ScoredIntelligence> {
    try {
      const content = await this.db.query(
        'SELECT * FROM research_content WHERE id = $1',
        [contentId]
      );

      if (content.rows.length === 0) {
        throw new Error('Content not found');
      }

      const data = content.rows[0];
      const metadata = JSON.parse(data.metadata || '{}');

      const factors = {
        relevance: this.calculateRelevance(metadata),
        recency: this.calculateRecency(data.created_at),
        quality: this.calculateQuality(metadata),
        uniqueness: await this.calculateUniqueness(contentId),
      };

      const score = this.calculateFinalScore(factors);

      return {
        id: contentId,
        score,
        factors,
      };
    } catch (error) {
      console.error('Scoring error:', error);
      throw error;
    }
  }

  private calculateRelevance(metadata: any): number {
    // Score based on metadata indicators
    if (!metadata) return 0.5;
    
    let score = 0.5;
    if (metadata.isVerified) score += 0.2;
    if (metadata.authority > 0.8) score += 0.15;
    if (metadata.matches > 3) score += 0.15;
    
    return Math.min(1, score);
  }

  private calculateRecency(createdAt: string): number {
    const daysSince = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSince < 1) return 1;
    if (daysSince < 7) return 0.9;
    if (daysSince < 30) return 0.7;
    if (daysSince < 90) return 0.5;
    return 0.3;
  }

  private calculateQuality(metadata: any): number {
    if (!metadata) return 0.5;
    
    let score = 0.5;
    if (metadata.sources && metadata.sources.length > 1) score += 0.2;
    if (metadata.confidence > 0.8) score += 0.15;
    if (!metadata.hasErrors) score += 0.15;
    
    return Math.min(1, score);
  }

  private async calculateUniqueness(contentId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT COUNT(*) as count FROM research_content 
       WHERE id != $1 AND content LIKE (
         SELECT SUBSTRING(content, 1, 50) FROM research_content WHERE id = $1
       )`,
      [contentId]
    );

    const count = parseInt(result.rows[0].count);
    
    if (count === 0) return 1;
    if (count < 3) return 0.8;
    if (count < 10) return 0.5;
    return 0.2;
  }

  private calculateFinalScore(factors: any): number {
    // Weighted average
    return (
      factors.relevance * 0.35 +
      factors.recency * 0.25 +
      factors.quality * 0.25 +
      factors.uniqueness * 0.15
    );
  }
        }
