
export class ActivityDisplayFix {
 
  static formatObject(obj: any, maxDepth = 3): string {
    if (obj === null || obj === undefined) return '';
    
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.formatObject(item, maxDepth - 1)).join(', ');
    }
    
    if (typeof obj === 'object') {
   
      if (obj instanceof Date) {
        return obj.toLocaleString();
      }
   
      if (obj.toString && obj.toString !== Object.prototype.toString) {
        return obj.toString();
      }
      
      if (maxDepth <= 0) {
        return '{...}';
      }
      
      try {
        const entries = Object.entries(obj)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}: ${this.formatObject(v, maxDepth - 1)}`);
        
        return entries.length > 0 ? `{${entries.join(', ')}}` : '{}';
      } catch {
        return '[Complex Object]';
      }
    }
    
    return String(obj);
  }


  static formatActivityDescription(activity: any): string {
    if (!activity) return '';
    
    const description = activity.description || activity.content || '';
    return this.formatObject(description);
  }


  static formatActivity(activity: any): string {
    if (!activity) return '';
    
    const assigner = activity.assigner || 'System';
    const assignee = activity.assignee || 'Unknown';
    const description = this.formatActivityDescription(activity);
    const timestamp = new Date(activity.createdTime || activity.timestamp || '').toLocaleString('vi-VN');
    
    return `${assigner} → ${assignee}: ${description} (${timestamp})`;
  }


  static processActivities(activities: any[]): any[] {
    if (!Array.isArray(activities)) return [];
    
    return activities.map(activity => ({
      ...activity,
      displayDescription: this.formatActivityDescription(activity),
      displayAssigner: activity.assigner || 'System',
      displayAssignee: activity.assignee || 'Unknown',
      displayTimestamp: new Date(activity.createdTime || activity.timestamp || '').toLocaleString('vi-VN')
    }));
  }
}
