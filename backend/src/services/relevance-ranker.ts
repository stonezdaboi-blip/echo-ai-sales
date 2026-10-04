export interface RankedResult {
  id: string;
  relevanceScore: number;
  rank: number;
}

export class RelevanceRanker {
  rank(results: any[], query: string): RankedResult[] {
    const scored = results.map(result => ({
      id: result.id,
      relevanceScore: this.calculateRelevance(result, query),
    }));

    const sorted = scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return sorted.map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
  }

  private calculateRelevance(result: any, query: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const content = (result.content || '').toLowerCase();
    
    let score = 0;
    
    // Exact phrase match
    if (content.includes(query.toLowerCase())) {
      score += 1.0;
    }
    
    // Term frequency
    const termMatches = queryTerms.filter(term => content.includes(term)).length;
    score += (termMatches / queryTerms.length) * 0.8;
    
    // Position scoring (earlier matches are better)
    const firstMatch = queryTerms.reduce((minPos, term) => {
      const pos = content.indexOf(term);
      return pos !== -1 ? Math.min(minPos, pos) : minPos;
    }, Infinity);
    
    if (firstMatch !== Infinity) {
      score += Math.max(0.5 - (firstMatch / content.length) * 0.5, 0);
    }
    
    return Math.min(score, 1);
  }
  }
