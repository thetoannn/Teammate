import { DOMMessageParser } from './DOMParser';

export interface FormattedMessage {
  type: 'text' | 'image' | 'table' | 'link' | 'code';
  content: string;
  attributes?: Record<string, string>;
}

export class MessageFormatter {
  static formatMessage(content: string): FormattedMessage[] {
    if (!content || content.trim() === '') {
      return [{ type: 'text', content: '' }];
    }

    
    const parsedElements = DOMMessageParser.parseMessage(content);
    
  
    if (parsedElements.length === 0) {
      return [{ type: 'text', content: content.trim() }];
    }

    return parsedElements;
  }

  static extractImages(content: string): string[] {
    const imageUrls: string[] = [];
    
    
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }
    
   
    const htmlImageRegex = /<img[^>]+src="([^">]+)"/g;
    while ((match = htmlImageRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }
    
   
    const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    while ((match = urlRegex.exec(content)) !== null) {
      if (!imageUrls.includes(match[1])) {
        imageUrls.push(match[1]);
      }
    }
    
    return imageUrls;
  }

  static extractTables(content: string): string[] {
   
    const markdownTables = DOMMessageParser.extractTablesFromMarkdown(content);
    
    
    const htmlTableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    const htmlTables: string[] = [];
    let match;
    
    while ((match = htmlTableRegex.exec(content)) !== null) {
      htmlTables.push(match[0]);
    }
    
    return [...markdownTables, ...htmlTables];
  }

  static convertToMarkdown(content: string): string {
    let markdown = content;
    
    
    const htmlTableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    markdown = markdown.replace(htmlTableRegex, (tableHtml) => {
      return DOMMessageParser.convertHtmlTableToMarkdown(tableHtml);
    });
    
   
    const linkRegex = /<a[^>]+href="([^">]+)"[^>]*>([^<]+)<\/a>/gi;
    markdown = markdown.replace(linkRegex, '[$2]($1)');
    
   
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*alt="([^">]*)"/gi;
    markdown = markdown.replace(imgRegex, '![$2]($1)');
    
   
    markdown = markdown.replace(/<[^>]*>/g, '');
    
    return markdown.trim();
  }

  static sanitizeContent(content: string): string {
  
    const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
    const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
    const iframeRegex = /<iframe[^>]*>[\s\S]*?<\/iframe>/gi;
    
    let sanitized = content;
    sanitized = sanitized.replace(scriptRegex, '');
    sanitized = sanitized.replace(styleRegex, '');
    sanitized = sanitized.replace(iframeRegex, '');
    
    return sanitized;
  }

  static formatForDisplay(content: string): string {
    
    let formatted = this.sanitizeContent(content);
    
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, '[$1]($1)');
    
  
    const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    formatted = formatted.replace(imageUrlRegex, '![Image]($1)');
    
    return formatted;
  }
}
