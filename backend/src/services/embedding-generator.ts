import axios from 'axios';
import { Pool } from 'pg';

export class EmbeddingGenerator {
  constructor(private db: Pool, private openaiKey: string) {}

  async generateAndStore(
    content: string,
    source: string,
    metadata: Record<string, any> = {}
  ): Promise<string> {
    try {
      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Store in database
      const result = await this.db.query(
        `INSERT INTO research_content (content, embedding, source, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id`,
        [content, JSON.stringify(embedding), source, JSON.stringify(metadata)]
      );

      return result.rows[0].id;
    } catch (error) {
      console.error('Embedding storage error:', error);
      throw new Error('Failed to generate and store embedding');
    }
  }

  async generateBatch(contents: string[], source: string): Promise<string[]> {
    const ids: string[] = [];

    for (const content of contents) {
      try {
        const id = await this.generateAndStore(content, source);
        ids.push(id);
      } catch (error) {
        console.error(`Failed to process content: ${content.substring(0, 50)}...`);
      }
    }

    return ids;
  }

  private async generateEmbedding(text: string): Promise<number[]> {
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
  }

  async getEmbedding(contentId: string): Promise<number[] | null> {
    const result = await this.db.query(
      'SELECT embedding FROM research_content WHERE id = $1',
      [contentId]
    );

    if (result.rows.length === 0) return null;

    return JSON.parse(result.rows[0].embedding);
  }
}
