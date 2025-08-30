export interface ParsedElement {
  type: 'text' | 'image' | 'table' | 'link' | 'code';
  content: string;
  attributes?: Record<string, string>;
}

export class DOMMessageParser {
  static parseMessage(content: string): ParsedElement[] {
    const elements: ParsedElement[] = [];
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      
      this.processNode(doc.body, elements);
      
    } catch (error) {
  
      elements.push({ type: 'text', content });
    }
    
    return elements;
  }

  private static processNode(node: Node, elements: ParsedElement[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text && text.length > 0) {
        elements.push({ type: 'text', content: text });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      
      switch (element.tagName.toLowerCase()) {
        case 'img':
          elements.push({
            type: 'image',
            content: element.getAttribute('src') || '',
            attributes: {
              alt: element.getAttribute('alt') || '',
              width: element.getAttribute('width') || '',
              height: element.getAttribute('height') || ''
            }
          });
          break;
          
        case 'table':
          elements.push({
            type: 'table',
            content: element.outerHTML
          });
          break;
          
        case 'a':
          elements.push({
            type: 'link',
            content: element.getAttribute('href') || '',
            attributes: {
              text: element.textContent || ''
            }
          });
          break;
          
        case 'code':
        case 'pre':
          elements.push({
            type: 'code',
            content: element.textContent || '',
            attributes: {
              language: element.className || ''
            }
          });
          break;
          
        default:
        
          Array.from(element.childNodes).forEach(child => {
            this.processNode(child, elements);
          });
      }
    }
  }

  static extractTablesFromMarkdown(markdown: string): string[] {
    const tableRegex = /\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g;
    const tables: string[] = [];
    let match;
    
    while ((match = tableRegex.exec(markdown)) !== null) {
      tables.push(match[0]);
    }
    
    return tables;
  }

  static convertHtmlTableToMarkdown(htmlTable: string): string {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlTable, 'text/html');
      const table = doc.querySelector('table');
      
      if (!table) return '';
      
      const rows = table.querySelectorAll('tr');
      let markdown = '';
      
      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        const rowContent = Array.from(cells)
          .map(cell => cell.textContent?.trim() || '')
          .join(' | ');
        
        markdown += `| ${rowContent} |\n`;
        
        if (index === 0) {
          const separator = Array.from(cells)
            .map(() => '---')
            .join(' | ');
          markdown += `| ${separator} |\n`;
        }
      });
      
      return markdown;
    } catch (error) {
      return '';
    }
  }

  static extractImageUrls(text: string): string[] {
    const imageUrls: string[] = [];
    
   
    const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(text)) !== null) {
      imageUrls.push(match[1]);
    }
    
    
    const htmlImageRegex = /<img[^>]+src="([^">]+)"/g;
    while ((match = htmlImageRegex.exec(text)) !== null) {
      imageUrls.push(match[1]);
    }
    
    
    const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp))/gi;
    while ((match = urlRegex.exec(text)) !== null) {
      if (!imageUrls.includes(match[1])) {
        imageUrls.push(match[1]);
      }
    }
    
    return imageUrls;
  }

  static sanitizeHtml(html: string): string {
    const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
    const styleRegex = /<style[^>]*>[\s\S]*?<\/style>/gi;
    const iframeRegex = /<iframe[^>]*>[\s\S]*?<\/iframe>/gi;
    
    let sanitized = html;
    sanitized = sanitized.replace(scriptRegex, '');
    sanitized = sanitized.replace(styleRegex, '');
    sanitized = sanitized.replace(iframeRegex, '');
    
    return sanitized;
  }
}
