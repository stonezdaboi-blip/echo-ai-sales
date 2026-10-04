import { Pool } from 'pg';

export interface Change {
  id: string;
  type: 'new' | 'updated' | 'removed' | 'escalated';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  previousValue?: any;
  newValue?: any;
}

export class ChangeDetector {
  constructor(private db: Pool) {}

  async detectChanges(queryId: string, currentData: any[]): Promise<Change[]> {
    try {
      const previousData = await this.getPreviousData(queryId);
      const changes: Change[] = [];

      // Detect new items
      for (const current of currentData) {
        const previous = previousData.find(p => p.id === current.id);
        if (!previous) {
          changes.push({
            id: current.id,
            type: 'new',
            title: `New item detected: ${current.name}`,
            description: current.description || '',
            severity: this.calculateSeverity(current),
            timestamp: new Date(),
            newValue: current,
          });
        } else if (this.hasChanged(previous, current)) {
          changes.push({
            id: current.id,
            type: 'updated',
            title: `Update detected: ${current.name}`,
            description: `Changes: ${this.getChangedFields(previous, current).join(', ')}`,
            severity: 'medium',
            timestamp: new Date(),
            previousValue: previous,
            newValue: current,
          });
        }
      }

      // Detect removed items
      for (const previous of previousData) {
        if (!currentData.find(c => c.id === previous.id)) {
          changes.push({
            id: previous.id,
            type: 'removed',
            title: `Item removed: ${previous.name}`,
            description: 'Previously tracked item no longer found',
            severity: 'low',
            timestamp: new Date(),
            previousValue: previous,
          });
        }
      }

      // Store changes
      for (const change of changes) {
        await this.storeChange(queryId, change);
      }

      return changes;
    } catch (error) {
      console.error('Change detection error:', error);
      throw error;
    }
  }

  private hasChanged(previous: any, current: any): boolean {
    const fieldsToCheck = ['status', 'name', 'value', 'metadata'];
    return fieldsToCheck.some(
      field => JSON.stringify(previous[field]) !== JSON.stringify(current[field])
    );
  }

  private getChangedFields(previous: any, current: any): string[] {
    const fields: string[] = [];
    for (const key in previous) {
      if (previous[key] !== current[key]) {
        fields.push(key);
      }
    }
    return fields;
  }

  private calculateSeverity(item: any): 'low' | 'medium' | 'high' | 'critical' {
    if (item.priority === 'critical') return 'critical';
    if (item.priority === 'high') return 'high';
    if (item.isUrgent) return 'high';
    return 'medium';
  }

  private async getPreviousData(queryId: string): Promise<any[]> {
    const result = await this.db.query(
      'SELECT data FROM research_snapshots WHERE query_id = $1 ORDER BY created_at DESC LIMIT 1',
      [queryId]
    );

    if (result.rows.length === 0) return [];
    return JSON.parse(result.rows[0].data);
  }

  private async storeChange(queryId: string, change: Change): Promise<void> {
    await this.db.query(
      `INSERT INTO changes (query_id, type, title, description, severity, data, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [queryId, change.type, change.title, change.description, change.severity, JSON.stringify(change)]
    );
  }
          }
