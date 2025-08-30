

export class ActivityFormatter {

  static formatValue(value: any, maxDepth = 3): string {
    if (value === null || value === undefined) {
      return 'Không có mô tả';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      if (maxDepth <= 0) return '[Array]';
      const formattedItems = value
        .slice(0, 10)
        .map(item => this.formatValue(item, maxDepth - 1));
      const suffix = value.length > 10 ? `... (+${value.length - 10} more)` : '';
      return `[${formattedItems.join(', ')}${suffix}]`;
    }

    if (typeof value === 'object') {
     
      if (value instanceof Date) {
        return value.toLocaleString('vi-VN');
      }

 
      if (value.toString && value.toString !== Object.prototype.toString) {
        return value.toString();
      }

    
      if (maxDepth <= 0) {
        return '{...}';
      }

      try {
        const entries = Object.entries(value)
          .filter(([_, v]) => v !== null && v !== undefined)
          .map(([k, v]) => `${k}: ${this.formatValue(v, maxDepth - 1)}`);
        
        return entries.length > 0 ? `{${entries.join(', ')}}` : '{}';
      } catch {
        return '[Complex Object]';
      }
    }

    return String(value);
  }

  
  static formatDescription(description: any): string {
    if (!description) {
      return 'Không có mô tả';
    }

    if (typeof description === 'string') {
      return description;
    }

 
    if (typeof description === 'string' && description.startsWith('{') && description.endsWith('}')) {
      try {
        const parsed = JSON.parse(description);
        return this.formatObject(parsed);
      } catch {
        return description;
      }
    }

    return this.formatObject(description);
  }

 
  static formatObject(obj: any): string {
    if (!obj) return '';

    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

    if (Array.isArray(obj)) {
      return obj.map(item => this.formatObject(item)).join('\n');
    }

    if (typeof obj === 'object') {
      try {
     
        if (obj.task) {
          return this.formatTaskObject(obj);
        }

      
        if (obj.campaign_name || obj.campaign_objective) {
          return this.formatCampaignObject(obj);
        }

        if (obj.ad_name || obj.ad_text) {
          return this.formatAdObject(obj);
        }

     
        const lines: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          if (value !== null && value !== undefined) {
            const formattedValue = this.formatValue(value, 2);
            lines.push(`**${key}:** ${formattedValue}`);
          }
        }
        return lines.join('\n');
      } catch {
        return String(obj);
      }
    }

    return String(obj);
  }

 
  private static formatTaskObject(obj: any): string {
    const lines: string[] = [];
    
    if (obj.task) lines.push(`**Task:** ${obj.task}`);
    if (obj.campaign_name) lines.push(`**Campaign:** ${obj.campaign_name}`);
    if (obj.ad_name) lines.push(`**Ad:** ${obj.ad_name}`);
    if (obj.ad_text) lines.push(`**Text:** ${obj.ad_text}`);
    if (obj.target_audience) lines.push(`**Target:** ${this.formatValue(obj.target_audience)}`);
    if (obj.budget) lines.push(`**Budget:** ${obj.budget}`);
    if (obj.duration) lines.push(`**Duration:** ${obj.duration}`);
    if (obj.image_url) lines.push(`**Image:** ${obj.image_url}`);
    
    return lines.join('\n');
  }


  private static formatCampaignObject(obj: any): string {
    const lines: string[] = [];
    
    if (obj.campaign_name) lines.push(`**Campaign Name:** ${obj.campaign_name}`);
    if (obj.campaign_objective) lines.push(`**Objective:** ${obj.campaign_objective}`);
    if (obj.status) lines.push(`**Status:** ${obj.status}`);
    if (obj.special_ad_categories) lines.push(`**Categories:** ${this.formatValue(obj.special_ad_categories)}`);
    
    return lines.join('\n');
  }


  private static formatAdObject(obj: any): string {
    const lines: string[] = [];
    
    if (obj.ad_name) lines.push(`**Ad Name:** ${obj.ad_name}`);
    if (obj.ad_text) lines.push(`**Text:** ${obj.ad_text}`);
    if (obj.image_url) lines.push(`**Image URL:** ${obj.image_url}`);
    if (obj.status) lines.push(`**Status:** ${obj.status}`);
    
    return lines.join('\n');
  }


  static processActivities(activities: any[]): any[] {
    if (!Array.isArray(activities)) return [];

    return activities.map(activity => ({
      ...activity,
      description: this.formatDescription(activity.description),
      displayTitle: this.formatValue(activity.title || activity.name),
      displayType: this.formatValue(activity.type || activity.assignee),
    }));
  }
}
