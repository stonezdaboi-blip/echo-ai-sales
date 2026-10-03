import axios from 'axios';
import { Pool } from 'pg';

export interface SearchResult {
  id: string;
  content: string;
  similarity: number;
  relevance: number;
  confidence: number;
  source: string;
}

export class SemanticSearcher {
  constructor(private db: Pool, private openaiKey: string) {}

  async search(query: string, limit: number = 10): Promise<SearchResult[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Search similar vectors in database
      const results = await this.db.query(
        `SELECT 
          id, 
          content, 
          source,
          1 - (embedding <=> $1::vector) as similarity
         FROM research_content
         WHERE 1 - (embedding <=> $1::vector) > 0.7
         ORDER BY similarity DESC
         LIMIT $2`,
        [queryEmbedding, limit]
      );

      // Rank by relevance
      return results.rows.map((row: any) => ({
        id: row.id,
        content: row.content,
        similarity: row.similarity,
        relevance: this.calculateRelevance(query, row.content),
        confidence: this.calculateConfidence(row.similarity),
        source: row.source,
      }));
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Semantic search failed');
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          input: text,
          model: 'text-embedding-3-small',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  private calculateRelevance(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    const matches = queryWords.filter(word => contentLower.includes(word)).length;
    return Math.min(1, matches / queryWords.length);
  }

  private calculateConfidence(similarity: number): number {
    // Convert similarity score to confidence percentage
    if (similarity > 0.85) return 0.95;
    if (similarity > 0.75) return 0.85;
    if (similarity > 0.7) return 0.70;
    return 0.5;
  }
        }
