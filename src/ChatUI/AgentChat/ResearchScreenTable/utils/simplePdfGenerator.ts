import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface SimplePDFOptions {
  filename?: string;
  scale?: number;
}

export const generateResearchReportSimplePDF = async (
  contentElement: HTMLElement,
  reportTitle: string = "Research Report"
): Promise<void> => {
  
  const filename = "Báo cáo nghiên cứu thị trường.pdf";
  
  try {
    // Find the actual markdown content container
    const markdownContent = contentElement.querySelector('.prose') || 
                           contentElement.querySelector('[class*="prose"]') ||
                           contentElement;

    if (!markdownContent) {
      throw new Error('Không tìm thấy nội dung markdown');
    }

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '1200px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.padding = '20px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '15px'; 
    tempContainer.style.lineHeight = '1.7'; 
    tempContainer.style.color = '#000000';
    tempContainer.style.boxSizing = 'border-box';

    const clonedContent = markdownContent.cloneNode(true) as HTMLElement;
    
    const watermarkElements = clonedContent.querySelectorAll('[style*="pointer-events: none"]');
    watermarkElements.forEach(el => el.remove());
    
    const allElements = clonedContent.querySelectorAll('*');
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.className = '';
      htmlEl.removeAttribute('style');
    });
    clonedContent.className = '';
    clonedContent.removeAttribute('style');
    
    applyPDFStyling(clonedContent);
    
    tempContainer.appendChild(clonedContent);
    document.body.appendChild(tempContainer);

    const canvas = await html2canvas(tempContainer, {
      scale: 1.5, 
      backgroundColor: '#ffffff',
      useCORS: false,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: false,
      logging: false,
      width: 1200,
      onclone: (clonedDoc) => {
        const clonedContainer = clonedDoc.querySelector('div[style*="position: absolute"]');
        if (clonedContainer) {
          const allEls = clonedContainer.querySelectorAll('*');
          allEls.forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.className = '';
            htmlEl.removeAttribute('style');
          });
          applyPDFStyling(clonedContainer as HTMLElement);
        }
      }
    });

    document.body.removeChild(tempContainer);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const margin = 15;
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);

    const widthRatio = availableWidth / canvasWidth;
    const heightRatio = availableHeight / canvasHeight;
    
    const scaledWidth = availableWidth; 
    const scaledHeight = canvasHeight * widthRatio;

    const imgData = canvas.toDataURL('image/png', 0.95);

    if (scaledHeight > availableHeight) {
      let remainingHeight = scaledHeight;
      let currentY = 0;
      let pageCount = 0;

      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        const pageHeight = Math.min(remainingHeight, availableHeight);
        const sourceY = currentY / widthRatio;
        const sourceHeight = pageHeight / widthRatio;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');

        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvasWidth, sourceHeight,
            0, 0, canvasWidth, sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
          pdf.addImage(pageImgData, 'PNG', margin, margin, scaledWidth, pageHeight);
        }

        remainingHeight -= pageHeight;
        currentY += pageHeight;
        pageCount++;
      }
    } else {
      pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Không thể tạo PDF. Vui lòng thử lại.");
  }
};

const convertToSafeColor = (element: HTMLElement): void => {
  const computedStyles = window.getComputedStyle(element);
  
  element.style.setProperty('color', '#000000', 'important');
  element.style.setProperty('background-color', 'transparent', 'important');
  element.style.setProperty('border-color', '#000000', 'important');
  
  for (let i = 0; i < computedStyles.length; i++) {
    const property = computedStyles[i];
    if (property.startsWith('--') || property.includes('color')) {
      element.style.removeProperty(property);
    }
  }
};

const applyPDFStyling = (element: HTMLElement): void => {
  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => convertToSafeColor(el as HTMLElement));
  convertToSafeColor(element);

  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    const htmlTable = table as HTMLElement;
    htmlTable.style.setProperty('width', '100%', 'important');
    htmlTable.style.setProperty('border-collapse', 'collapse', 'important');
    htmlTable.style.setProperty('margin-bottom', '24px', 'important');
    htmlTable.style.setProperty('font-size', '13px', 'important'); // Slightly larger for better readability
    htmlTable.style.setProperty('border', '1px solid #000000', 'important');
    htmlTable.style.setProperty('background-color', '#ffffff', 'important');
    htmlTable.style.setProperty('color', '#000000', 'important');
    htmlTable.style.setProperty('table-layout', 'auto', 'important'); // Allow dynamic column sizing
  });

  const ths = element.querySelectorAll('th');
  ths.forEach(th => {
    const htmlTh = th as HTMLElement;
    htmlTh.style.setProperty('background-color', '#f5f5f5', 'important');
    htmlTh.style.setProperty('font-weight', 'bold', 'important');
    htmlTh.style.setProperty('padding', '12px 10px', 'important'); // More padding for better readability
    htmlTh.style.setProperty('border', '1px solid #000000', 'important');
    htmlTh.style.setProperty('text-align', 'left', 'important');
    htmlTh.style.setProperty('color', '#000000', 'important');
    htmlTh.style.setProperty('font-size', '13px', 'important');
  });

  const tds = element.querySelectorAll('td');
  tds.forEach(td => {
    const htmlTd = td as HTMLElement;
    htmlTd.style.setProperty('padding', '10px', 'important'); // More generous padding
    htmlTd.style.setProperty('border', '1px solid #000000', 'important');
    htmlTd.style.setProperty('vertical-align', 'top', 'important');
    htmlTd.style.setProperty('color', '#000000', 'important');
    htmlTd.style.setProperty('background-color', '#ffffff', 'important');
    htmlTd.style.setProperty('line-height', '1.5', 'important'); // Better line spacing
  });

  const h1s = element.querySelectorAll('h1');
  h1s.forEach(h1 => {
    const htmlH1 = h1 as HTMLElement;
    htmlH1.style.setProperty('font-size', '26px', 'important'); // Slightly larger for better presence
    htmlH1.style.setProperty('font-weight', 'bold', 'important');
    htmlH1.style.setProperty('margin-bottom', '20px', 'important');
    htmlH1.style.setProperty('margin-top', '30px', 'important');
    htmlH1.style.setProperty('color', '#000000', 'important');
    htmlH1.style.setProperty('border-bottom', '2px solid #000000', 'important');
    htmlH1.style.setProperty('padding-bottom', '10px', 'important');
    htmlH1.style.setProperty('background-color', 'transparent', 'important');
    htmlH1.style.setProperty('line-height', '1.3', 'important');
  });

  const h2s = element.querySelectorAll('h2');
  h2s.forEach(h2 => {
    const htmlH2 = h2 as HTMLElement;
    htmlH2.style.setProperty('font-size', '20px', 'important');
    htmlH2.style.setProperty('font-weight', 'bold', 'important');
    htmlH2.style.setProperty('margin-bottom', '12px', 'important');
    htmlH2.style.setProperty('margin-top', '20px', 'important');
    htmlH2.style.setProperty('color', '#000000', 'important');
    htmlH2.style.setProperty('background-color', 'transparent', 'important');
  });

  const h3s = element.querySelectorAll('h3');
  h3s.forEach(h3 => {
    const htmlH3 = h3 as HTMLElement;
    htmlH3.style.setProperty('font-size', '16px', 'important');
    htmlH3.style.setProperty('font-weight', 'bold', 'important');
    htmlH3.style.setProperty('margin-bottom', '8px', 'important');
    htmlH3.style.setProperty('margin-top', '16px', 'important');
    htmlH3.style.setProperty('color', '#000000', 'important');
    htmlH3.style.setProperty('background-color', 'transparent', 'important');
  });

  const ps = element.querySelectorAll('p');
  ps.forEach(p => {
    const htmlP = p as HTMLElement;
    htmlP.style.setProperty('margin-bottom', '12px', 'important');
    htmlP.style.setProperty('line-height', '1.6', 'important');
    htmlP.style.setProperty('color', '#000000', 'important');
    htmlP.style.setProperty('text-align', 'justify', 'important');
    htmlP.style.setProperty('background-color', 'transparent', 'important');
  });

  const uls = element.querySelectorAll('ul');
  uls.forEach(ul => {
    const htmlUl = ul as HTMLElement;
    htmlUl.style.setProperty('margin-bottom', '12px', 'important');
    htmlUl.style.setProperty('padding-left', '20px', 'important');
    htmlUl.style.setProperty('color', '#000000', 'important');
    htmlUl.style.setProperty('background-color', 'transparent', 'important');
  });

  const ols = element.querySelectorAll('ol');
  ols.forEach(ol => {
    const htmlOl = ol as HTMLElement;
    htmlOl.style.setProperty('margin-bottom', '12px', 'important');
    htmlOl.style.setProperty('padding-left', '20px', 'important');
    htmlOl.style.setProperty('color', '#000000', 'important');
    htmlOl.style.setProperty('background-color', 'transparent', 'important');
  });

  const lis = element.querySelectorAll('li');
  lis.forEach(li => {
    const htmlLi = li as HTMLElement;
    htmlLi.style.setProperty('margin-bottom', '4px', 'important');
    htmlLi.style.setProperty('line-height', '1.6', 'important');
    htmlLi.style.setProperty('color', '#000000', 'important');
    htmlLi.style.setProperty('background-color', 'transparent', 'important');
  });

  const blockquotes = element.querySelectorAll('blockquote');
  blockquotes.forEach(blockquote => {
    const htmlBlockquote = blockquote as HTMLElement;
    htmlBlockquote.style.setProperty('border-left', '4px solid #cccccc', 'important');
    htmlBlockquote.style.setProperty('padding-left', '16px', 'important');
    htmlBlockquote.style.setProperty('margin-left', '0', 'important');
    htmlBlockquote.style.setProperty('margin-bottom', '12px', 'important');
    htmlBlockquote.style.setProperty('font-style', 'italic', 'important');
    htmlBlockquote.style.setProperty('background-color', '#f9f9f9', 'important');
    htmlBlockquote.style.setProperty('padding', '12px 16px', 'important');
    htmlBlockquote.style.setProperty('color', '#000000', 'important');
  });

  const codes = element.querySelectorAll('code');
  codes.forEach(code => {
    const htmlCode = code as HTMLElement;
    if (htmlCode.parentElement?.tagName === 'PRE') {
      htmlCode.style.setProperty('background-color', '#f5f5f5', 'important');
      htmlCode.style.setProperty('padding', '12px', 'important');
      htmlCode.style.setProperty('border', '1px solid #dddddd', 'important');
      htmlCode.style.setProperty('border-radius', '4px', 'important');
      htmlCode.style.setProperty('font-size', '12px', 'important');
      htmlCode.style.setProperty('font-family', 'monospace', 'important');
      htmlCode.style.setProperty('display', 'block', 'important');
      htmlCode.style.setProperty('white-space', 'pre-wrap', 'important');
      htmlCode.style.setProperty('overflow-wrap', 'break-word', 'important');
      htmlCode.style.setProperty('color', '#000000', 'important');
    } else {
      htmlCode.style.setProperty('background-color', '#f0f0f0', 'important');
      htmlCode.style.setProperty('padding', '2px 4px', 'important');
      htmlCode.style.setProperty('border-radius', '2px', 'important');
      htmlCode.style.setProperty('font-size', '12px', 'important');
      htmlCode.style.setProperty('font-family', 'monospace', 'important');
      htmlCode.style.setProperty('color', '#d63384', 'important');
    }
  });
};

export const generateSimplePDF = async (
  element: HTMLElement,
  options: SimplePDFOptions = {}
): Promise<void> => {
  const {
    filename = 'research_report.pdf',
    scale = 1.5
  } = options;

  try {
   
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '800px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.padding = '15px';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '13px';
    tempContainer.style.lineHeight = '1.5';
    tempContainer.style.color = '#000000';

 
    const extractContent = (sourceElement: HTMLElement): string => {
      let content = '';
      const walker = document.createTreeWalker(
        sourceElement,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              if (element.classList.contains('watermark') || 
                  element.classList.contains('WatermarkOverlay') ||
                  element.className.includes('watermark') ||
                  element.tagName.toLowerCase() === 'watermarkoverlay' ||
                 
                  (element.textContent && element.textContent.includes('TeamMATE Research AI')) ||
                
                  (element instanceof HTMLElement && element.style.pointerEvents === 'none' && element.style.position === 'absolute') ||
                  
                  element.closest('[class*="watermark"]') ||
                  element.closest('.WatermarkOverlay')) {
                return NodeFilter.FILTER_REJECT;
              }
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text && !text.includes('TeamMATE Research AI')) {
            content += text + ' ';
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          const tagName = element.tagName.toLowerCase();
          
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'li'].includes(tagName)) {
            content += '\n';
          }
        }
      }
      
      return content;
    };


    const textContent = extractContent(element);
    

    const lines = textContent.split('\n').filter(line => line.trim());
    let htmlContent = '';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
  
        if (trimmedLine.includes('BÁO CÁO') || trimmedLine.includes('NGHIÊN CỨU')) {
          htmlContent += `<h1 style="font-size: 18px; font-weight: bold; margin: 15px 15px 15px 15px; color: #000; text-align: justify;">${trimmedLine}</h1>`;
        } else if (trimmedLine.match(/^\d+\./)) {
          htmlContent += `<h2 style="font-size: 16px; font-weight: bold; margin: 15px 15px 15px 15px; color: #000; text-align: justify;">${trimmedLine}</h2>`;
        } else if (trimmedLine.includes('TÓM TẮT') || trimmedLine.includes('GIỚI THIỆU')) {
          htmlContent += `<h2 style="font-size: 16px; font-weight: bold; margin: 15px 15px 15px 15px; color: #000; text-align: justify;">${trimmedLine}</h2>`;
        } else {
          htmlContent += `<p style="margin: 15px 15px 15px 15px; color: #000; line-height: 1.6; text-align: justify;">${trimmedLine}</p>`;
        }
      }
    });

    tempContainer.innerHTML = htmlContent;
    document.body.appendChild(tempContainer);


    const canvas = await html2canvas(tempContainer, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: false,
      allowTaint: false,
      foreignObjectRendering: false,
      removeContainer: false
    });

  
    document.body.removeChild(tempContainer);


    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const margin = 15;
    const availableWidth = pdfWidth - (2 * margin);
    const availableHeight = pdfHeight - (2 * margin);

    const widthRatio = availableWidth / canvasWidth;
    const scaledWidth = availableWidth; 
    const scaledHeight = canvasHeight * widthRatio;

    const x = margin;
    const y = margin;

    const imgData = canvas.toDataURL('image/png', 0.95);


    if (scaledHeight > availableHeight) {
      let remainingHeight = scaledHeight;
      let currentY = 0;
      let pageCount = 0;

      while (remainingHeight > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        const pageHeight = Math.min(remainingHeight, availableHeight);
        const sourceY = currentY / widthRatio;
        const sourceHeight = pageHeight / widthRatio;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');

        if (pageCtx) {
          pageCtx.drawImage(
            canvas,
            0, sourceY, canvasWidth, sourceHeight,
            0, 0, canvasWidth, sourceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/png', 0.95);
          pdf.addImage(pageImgData, 'PNG', x, y, scaledWidth, pageHeight);
        }

        remainingHeight -= pageHeight;
        currentY += pageHeight;
        pageCount++;
      }
    } else {
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Error generating simple PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
