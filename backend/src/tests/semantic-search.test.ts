import axios from 'axios';
import { SemanticSearcher } from '../services/semantic-searcher';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SemanticSearcher', () => {
  let searcher: SemanticSearcher;
  let mockDb: {
    query: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDb = {
      query: jest.fn(),
    };

    searcher = new SemanticSearcher(
      mockDb as any,
      'test-key'
    );
  });

  test('rejects when queryId is missing', async () => {
    await expect(
      searcher.search('', 'test query')
    ).rejects.toThrow('queryId is required.');

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  test('returns empty results for an empty query', async () => {
    const result = await searcher.search(
      'research-1',
      '   '
    );

    expect(result).toEqual([]);
    expect(mockDb.query).not.toHaveBeenCalled();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  test('rejects when OpenAI key is missing', async () => {
    const searcherWithoutKey = new SemanticSearcher(
      mockDb as any,
      ''
    );

    await expect(
      searcherWithoutKey.search(
        'research-1',
        'test query'
      )
    ).rejects.toThrow(
      'OPENAI_API_KEY is not configured.'
    );
  });

  test('generates an embedding and searches PostgreSQL', async () => {
    const embedding = [0.1, 0.2, 0.3];

    mockedAxios.post.mockResolvedValue({
      data: {
        data: [
          {
            embedding,
          },
        ],
      },
    } as any);

    mockDb.query.mockResolvedValue({
      rows: [
        {
          id: 'result-1',
          content: 'Relevant research content',
          source: 'example.com',
          similarity: 0.95,
        },
      ],
    });

    const result = await searcher.search(
      'research-1',
      'test query'
    );

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.openai.com/v1/embeddings',
      {
        input: 'test query',
        model: 'text-embedding-3-small',
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
      })
    );

    expect(mockDb.query).toHaveBeenCalled();

    expect(result).toEqual([
      {
        id: 'result-1',
        content: 'Relevant research content',
        source: 'example.com',
        similarity: 0.95,
        relevance: 0.95,
        confidence: 0.95,
      },
    ]);
  });

  test('returns ranked results with calculated confidence', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
          },
        ],
      },
    } as any);

    mockDb.query.mockResolvedValue({
      rows: [
        {
          id: 'high',
          content: 'High similarity',
          source: 'source-a',
          similarity: 0.95,
        },
        {
          id: 'medium',
          content: 'Medium similarity',
          source: 'source-b',
          similarity: 0.82,
        },
        {
          id: 'low',
          content: 'Lower similarity',
          source: 'source-c',
          similarity: 0.71,
        },
      ],
    });

    const result = await searcher.search(
      'research-1',
      'test query'
    );

    expect(result).toHaveLength(3);

    expect(result[0].id).toBe('high');
    expect(result[0].confidence).toBe(0.95);

    expect(result[1].id).toBe('medium');
    expect(result[1].confidence).toBe(0.85);

    expect(result[2].id).toBe('low');
    expect(result[2].confidence).toBe(0.75);
  });

  test('propagates database errors', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: [
          {
            embedding: [0.1, 0.2, 0.3],
          },
        ],
      },
    } as any);

    mockDb.query.mockRejectedValue(
      new Error('DB Error')
    );

    await expect(
      searcher.search(
        'research-1',
        'test query'
      )
    ).rejects.toThrow('DB Error');
  });

  test('rejects invalid OpenAI embedding responses', async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: [],
      },
    } as any);

    await expect(
      searcher.search(
        'research-1',
        'test query'
      )
    ).rejects.toThrow(
      'OpenAI returned an invalid embedding.'
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});
