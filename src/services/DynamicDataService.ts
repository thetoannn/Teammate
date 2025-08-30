import axios from 'axios';

interface AgentActivity {
  id: string;
  description: string;
  from: string;
  to: string;
  timestamp: string;
  status: string;
  metadata?: any;
}

interface CampaignData {
  campaignName: string;
  campaignId: string;
  status: string;
  objective: string;
  dailyBudget: number;
  startDate: string;
  endDate: string;
  adContent: {
    primaryText: string;
    carouselCards: Array<{
      title: string;
      imageUrl?: string;
    }>;
    callToAction: string;
  };
}

class DynamicDataService {
  private baseURL = 'https://api.nhansuso.vn/api';
  
  async fetchAgentActivities(pageNumber: number = 1, pageSize: number = 30): Promise<AgentActivity[]> {
    try {
      const token = localStorage.getItem('authToken') || '';
      const response = await axios.get(
        `${this.baseURL}/agent-activities/get-agent-activities`,
        {
          params: { PageNumber: pageNumber, PageSize: pageSize },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  extractCampaignData(activity: AgentActivity): CampaignData | null {
    try {

      if (activity.metadata) {
        const meta = activity.metadata;
      
        if (meta.campaign_details && meta.ad_set_details) {
          const campaign = meta.campaign_details;
          const adSet = meta.ad_set_details;
          const creative = meta.ad_creative_details || {};
          
          return {
            campaignName: campaign.name || 'Chiến dịch không tên',
            campaignId: campaign.id || activity.id,
            status: 'ACTIVE',
            objective: campaign.objective || 'MESSAGES',
            dailyBudget: adSet.daily_budget || adSet.dailyBudget || 200000,
            startDate: adSet.start_time || new Date().toISOString(),
            endDate: adSet.end_time || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            adContent: {
              primaryText: creative.message || activity.description || '',
              carouselCards: this.extractCarouselCards(creative, meta),
              callToAction: creative.call_to_action || 'Đồng ý với nội dung này'
            }
          };
        }
      }
      
   
      if (activity.description.includes('campaign') || activity.description.includes('chiến dịch')) {
        return this.parseFromDescription(activity);
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting campaign data:', error);
      return null;
    }
  }

  private extractCarouselCards(creative: any, meta: any): Array<{title: string, imageUrl?: string}> {
    const cards = [];
    
   
    if (creative.carousel_cards) {
      cards.push(...creative.carousel_cards);
    }
    
   
    if (meta.ad_creative_details?.carousel_cards) {
      cards.push(...meta.ad_creative_details.carousel_cards);
    }
    
   
    if (cards.length === 0 && creative.title) {
      cards.push({
        title: creative.title || creative.name || 'Quảng cáo',
        imageUrl: creative.image_url || creative.imageUrl
      });
    }
    
    return cards;
  }

  private parseFromDescription(activity: AgentActivity): CampaignData | null {
    try {
      
      const desc = activity.description;
      
      
      const nameMatch = desc.match(/tên chiến dịch:\s*([^,]+)/i) || 
                       desc.match(/campaign name:\s*([^,]+)/i);
      
     
      const budgetMatch = desc.match(/ngân sách:\s*([\d,]+)/i) ||
                         desc.match(/budget:\s*([\d,]+)/i);
      
     
      const startMatch = desc.match(/bắt đầu:\s*([^,]+)/i) ||
                        desc.match(/start:\s*([^,]+)/i);
      
      const endMatch = desc.match(/kết thúc:\s*([^,]+)/i) ||
                      desc.match(/end:\s*([^,]+)/i);
      
      return {
        campaignName: nameMatch ? nameMatch[1].trim() : 'Chiến dịch mới',
        campaignId: activity.id,
        status: activity.status || 'ACTIVE',
        objective: 'MESSAGES',
        dailyBudget: budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 200000,
        startDate: startMatch ? new Date(startMatch[1].trim()).toISOString() : new Date().toISOString(),
        endDate: endMatch ? new Date(endMatch[1].trim()).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        adContent: {
          primaryText: desc,
          carouselCards: [{
            title: 'Sản phẩm mới',
            imageUrl: undefined
          }],
          callToAction: 'Đồng ý với nội dung này'
        }
      };
    } catch (error) {
      return null;
    }
  }

  async getCampaignReports(): Promise<CampaignData[]> {
    try {
      const activities = await this.fetchAgentActivities();
      const campaigns = activities
        .map(activity => this.extractCampaignData(activity))
        .filter(campaign => campaign !== null) as CampaignData[];
      
      return campaigns;
    } catch (error) {
      console.error('Error getting campaign reports:', error);
      return [];
    }
  }
}

export default new DynamicDataService();
