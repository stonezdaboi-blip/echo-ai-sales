import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';

class ResearchAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getResearches() {
    const response = await this.client.get('/researches');
    return response.data;
  }

  async getResearch(queryId: string) {
    const response = await this.client.get(`/research/${queryId}`);
    return response.data;
  }

  async createResearch(query: string, prospects: string[]) {
    const response = await this.client.post('/research', {
      query,
      prospects,
    });
    return response.data;
  }

  async search(queryId: string, query: string) {
    const response = await this.client.post(`/research/${queryId}/search`, {
      query,
    });
    return response.data;
  }

  async getPatterns(queryId: string) {
    const response = await this.client.get(`/research/${queryId}/patterns`);
    return response.data;
  }

  async getAlerts(queryId: string) {
    const response = await this.client.get(`/research/${queryId}/alerts`);
    return response.data;
  }
}

class SearchAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  async getStats() {
    const response = await this.client.get('/search/stats');
    return response.data;
  }

  async getQuality() {
    const response = await this.client.get('/search/quality');
    return response.data;
  }
}

export const researchAPI = new ResearchAPI();
export const searchAPI = new SearchAPI();
