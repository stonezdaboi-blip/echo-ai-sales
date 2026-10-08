import axios from 'axios';
import { Pool } from 'pg';

export interface SemanticSearchResult {
  id: string;
  content: string;
  source: string | null;
  similarity: number;
  relevance: number;
  confidence: number;
}

export class SemanticSearcher {
  constructor(
    private readonly db: Pool,
    private readonly openaiKey: string
  ) {}

  async search(
    queryId: string,
    query: string,
    limit = 10
  ): Promise<SemanticSearchResult[]> {
    if (!queryId) {
      throw new Error('queryId is required.');
    }

    if (!query.trim()) {
      return [];
    }

    if (!this.openaiKey) {
      throw new Error('OPENAI_API_KEY is not configured.');
    }

    const queryEmbedding = await this.generateEmbedding(query);

    const result = await this.db.query(
      `
      SELECT
        id,
        content,
        source,
        1 - (embedding <=> $1::vector) AS similarity
      FROM research_content
      WHERE query_id = $2
        AND embedding IS NOT NULL
        AND 1 - (embedding <=> $1::vector) > 0.7
      ORDER BY similarity DESC
      LIMIT $3
      `,
      [
        JSON.stringify(queryEmbedding),
        queryId,
        limit,
      ]
    );

    return result.rows.map((row) => {
      const similarity = Number(row.similarity);

      return {
        id: row.id,
        content: row.content,
        source: row.source,
        similarity,
        relevance: Math.max(
          0,
          Math.min(1, similarity)
        ),
        confidence: this.calculateConfidence(
          similarity
        ),
      };
    });
  }

  private async generateEmbedding(
    text: string
  ): Promise<number[]> {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-3-small',
      },
      {
        headers: {
          Authorization: `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const embedding =
      response.data?.data?.[0]?.embedding;

    if (!Array.isArray(embedding)) {
      throw new Error(
        'OpenAI returned an invalid embedding.'
      );
    }

    return embedding;
  }

  private calculateConfidence(
    similarity: number
  ): number {
    if (similarity >= 0.9) {
      return 0.95;
    }

    if (similarity >= 0.8) {
      return 0.85;
    }

    if (similarity >= 0.7) {
      return 0.75;
    }

    return 0.5;
  }
}
