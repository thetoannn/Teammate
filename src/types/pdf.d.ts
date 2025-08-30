declare module 'jspdf' {
  export default class jsPDF {
    constructor(options?: {
      orientation?: 'portrait' | 'landscape';
      unit?: 'mm' | 'cm' | 'in' | 'px';
      format?: string | number[];
    });
    
    addImage(
      imageData: string,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    
    addPage(): void;
    save(filename: string): void;
  }
}

declare module 'html2canvas' {
  interface Html2CanvasOptions {
    backgroundColor?: string;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    width?: number;
    height?: number;
  }
  
  export default function html2canvas(
    element: HTMLElement,
    options?: Html2CanvasOptions
  ): Promise<HTMLCanvasElement>;
}
