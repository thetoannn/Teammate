import axios from 'axios';

interface AgentActivity {
  id: string;
  name: string;
  description: string;
  assigner: string;
  assignee: string;
  createdAt: string;
  status: string;
}

interface GetAgentActivitiesParams {
  PageNumber?: number;
  PageSize?: number;
  search?: string;
  status?: string;
}

const AgentActivityService = {
  async getAgentActivities<T = AgentActivity[]>(params: GetAgentActivitiesParams = {}) {
    const response = await axios.get<T>('https://api.nhansuso.vn/api/agent-activities/get-agent-activities', {
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },
};

export default AgentActivityService;
