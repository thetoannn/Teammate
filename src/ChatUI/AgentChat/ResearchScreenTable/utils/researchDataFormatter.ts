export interface ResearchData {
  reportTitle: string;
  reportId: string;
  marketSegment: string;
  researchType: string;
  status: string;
  dataPoints: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  keyFindings: string[];
  methodology: {
    sampleSize: number;
    dataCollection: string;
    analysisMethod: string;
  };
  marketSize: {
    value: string;
    currency: string;
    growthRate: string;
  };
}

export const formatResearchDataToText = (researchData: ResearchData): string => {
  if (!researchData) {
    return "[Auto] Market Research - No research data available";
  }

  const reportInfo = `${researchData.reportTitle} - ${researchData.marketSegment} (${researchData.dataPoints} data points)`;
  
  return `[Auto] Market Research - ${reportInfo}`;
};

export const formatResearchDataToShortText = (researchData: ResearchData): string => {
  if (!researchData) {
    return "[Auto] Market Research - No data";
  }

  const shortTitle = researchData.reportTitle.length > 50 
    ? researchData.reportTitle.substring(0, 50) + "..." 
    : researchData.reportTitle;
  
  return `[Auto] Market Research - ${shortTitle} (${researchData.dataPoints} points)`;
};

export const extractTableContentForCopy = (containerElement: HTMLElement): string => {
  if (!containerElement) {
    return "No content available";
  }

 
  const clonedContainer = containerElement.cloneNode(true) as HTMLElement;
  
 
  const watermarkElements = clonedContainer.querySelectorAll('[class*="watermark"], [class*="WatermarkOverlay"]');
  watermarkElements.forEach(element => element.remove());
  

  const absoluteElements = clonedContainer.querySelectorAll('[style*="position: absolute"]');
  absoluteElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element as Element);
    if (computedStyle.position === 'absolute' && computedStyle.zIndex === '0') {
      element.remove();
    }
  });


  const textContent = clonedContainer.innerText || clonedContainer.textContent || '';
  
 
  const cleanedText = textContent
    .replace(/\s+/g, ' ') 
    .replace(/\n\s*\n/g, '\n\n') 
    .trim();

  return cleanedText;
};
