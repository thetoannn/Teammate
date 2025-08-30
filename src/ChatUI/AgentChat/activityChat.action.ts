import { AgentChatService } from './AgentChatService';
import { AgentActivity } from './AgentChatTypes';

export interface AgentActivityDetailResponse {
  id: string;
  userId: string;
  assigner: string;
  assignee: string;
  description: string;
  createdTime: string;
}

export const getAgentActivities = async (params: Record<string, unknown>) => {
  console.log('Fetching agent activities with params:', params);
  
  const response = await AgentChatService.getInstance().getAgentActivities(
    parseInt(params.PageNumber as string) || 1,
    parseInt(params.PageSize as string) || 30
  );
  
  console.log('Response from AgentChatService:', response);
  

  const processedItems = response.map(item => {
    console.log('Processing item in activityChat.action:', item);
    
    return {
      id: item.id || '',
      userId: item.userId || 'unknown',
      assigner: item.assigner || 'system',
      assignee: item.assignee || 'unknown',
      description: typeof item.description === 'object' 
        ? JSON.stringify(item.description, null, 2) 
        : String(item.description || 'No description provided'),
      createdTime: item.createdTime || item.timestamp || new Date().toISOString()
    };
  }) as AgentActivityDetailResponse[];
  
  console.log('Final processed items:', processedItems);
  
  return {
    items: processedItems,
    totalCount: processedItems.length,
    pageNumber: parseInt(params.PageNumber as string) || 1,
    pageSize: parseInt(params.PageSize as string) || 30,
    totalPages: Math.ceil(processedItems.length / (parseInt(params.PageSize as string) || 30))
  };
};
