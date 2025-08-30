
export interface AgentMessage {
  id: string;
  content: string;
  type: 'text' | 'table' | 'image' | 'mixed';
  timestamp: Date;
  sender: 'user' | 'agent' | 'ai';
  variant?: 'text' | 'canvas';
  metadata?: {
    tableData?: any[];
    imageUrl?: string;
    imageAlt?: string;
    markdown?: boolean;
    [key: string]: any;
  };
}

export interface AgentChatState {
  messages: AgentMessage[];
  isTyping: boolean;
  currentAgent: string | null;
  sessionId: string;
}

export interface AgentActivity {
  id: string;
  agentName?: string;
  activityType?: string;
  timestamp?: string;
  details?: any;
  userId?: string;
  assigner?: string;
  assignee?: string;
  description?: string;
  createdTime?: string;

  status?: string;           

}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  tableData?: any[];
  imageUrl?: string;
  imageAlt?: string;
}