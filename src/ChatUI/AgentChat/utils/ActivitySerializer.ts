

export interface SerializedActivity {
  id: string;
  agentName: string;
  activityType: string;
  timestamp: string;
  details: string;
  rawDetails: any;
}

export class ActivitySerializer {

  static serializeActivity(activity: any): SerializedActivity {
    return {
      id: activity.id || '',
      agentName: activity.agentName || activity.assignee || 'Unknown Agent',
      activityType: activity.activityType || 'Unknown Activity',
      timestamp: activity.timestamp || activity.createdTime || new Date().toISOString(),
      details: this.serializeDetails(activity.details || activity.description || ''),
      rawDetails: activity.details || activity.description || null
    };
  }


  static serializeDetails(details: any): string {
    if (!details) return '';
    
    if (typeof details === 'string') return details;
    if (typeof details === 'number') return details.toString();
    if (typeof details === 'boolean') return details ? 'true' : 'false';
    
    if (Array.isArray(details)) {
      return details.map(item => this.serializeDetails(item)).join(', ');
    }
    
    if (typeof details === 'object') {
  
      const entries = Object.entries(details);
      if (entries.length === 0) return '{}';
      
      return entries
        .map(([key, value]) => `${key}: ${this.serializeDetails(value)}`)
        .join('; ');
    }
    
    return String(details);
  }


  static serializeActivities(activities: any[]): SerializedActivity[] {
    if (!Array.isArray(activities)) {
      console.warn('Expected array of activities, got:', typeof activities);
      return [];
    }
    
    return activities.map(activity => this.serializeActivity(activity));
  }

 
  static formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  }
}
