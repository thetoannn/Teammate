
export class ObjectDisplayEnhanced {
 
  static stringifyObject(obj: any, maxDepth = 3): string {
    if (obj === null || obj === undefined) return '';
    
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.stringifyObject(item, maxDepth - 1)).join(', ');
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
          .map(([k, v]) => `${k}: ${this.stringifyObject(v, maxDepth - 1)}`);
        
        return entries.length > 0 ? `{${entries.join(', ')}}` : '{}';
      } catch {
        return '[Object]';
      }
    }
    
    return String(obj);
  }

  static formatForDisplay(content: any): string {
    if (!content) return '';
    
    if (typeof content === 'string') return content;
    
    if (Array.isArray(content)) {
      return content.map(item => this.stringifyObject(item, 2)).join('\n');
    }
    
    if (typeof content === 'object') {
      return this.stringifyObject(content, 3);
    }
    
    return String(content);
  }

  static formatActivityDescription(activity: any): string {
    if (!activity) return '';
    
    const description = activity.description || activity.content || activity.message || '';
    return this.formatForDisplay(description);
  }

  static formatActivityTitle(activity: any): string {
    if (!activity) return 'Activity';
    
    const title = activity.title || activity.name || activity.type || 'Activity';
    return this.formatForDisplay(title);
  }


  static formatActivityDetails(activity: any): string {
    if (!activity) return '';
    
    const details = [];
    
    if (activity.assigner) details.push(`From: ${activity.assigner}`);
    if (activity.assignee) details.push(`To: ${activity.assignee}`);
    if (activity.status) details.push(`Status: ${activity.status}`);
    if (activity.timestamp) {
      details.push(`Time: ${new Date(activity.timestamp).toLocaleString()}`);
    }
    
    return details.join(' • ');
  }

  static formatActivity(activity: any): string {
    if (!activity) return '';
    
    const title = this.formatActivityTitle(activity);
    const description = this.formatActivityDescription(activity);
    const details = this.formatActivityDetails(activity);
    
    return `${title}\n${description}\n${details}`;
  }
}
