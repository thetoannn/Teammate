import appConfig from '../../configs/app.config';
import { BaseCoreService } from '../../services/base/BaseService';
import { AgentActivity, AgentMessage } from './AgentChatTypes';
import { UnicodeHelper } from '../../helper/UnicodeHelper';

export class AgentChatService {
  private static instance: AgentChatService;
  private readonly backendUrl = 'https://teammate.nhansuso.vn';
  private readonly baseUrl = appConfig.apiCorePrefix;

  public static getInstance(): AgentChatService {
    if (!AgentChatService.instance) {
      AgentChatService.instance = new AgentChatService();
    }
    return AgentChatService.instance;
  }

  async runSuperAgent(sessionId: string, promptData: string): Promise<Response> {
    try {
      console.log('🚀 Making request to run_super_agent:', {
        url: 'https://agent.sieutho.vn/api/v1/agents/run_super_agent',
        sessionId,
        promptData,
        timestamp: new Date().toISOString()
      });

      // FORCE NETWORK VISIBILITY - Multiple strategies to ensure DevTools shows the request
      const uniqueParam = `?_devtools=${Date.now()}&_cache_bust=${Math.random().toString(36)}&_force_visible=true`;
      const url = `https://agent.sieutho.vn/api/v1/agents/run_super_agent${uniqueParam}`;

      // Create a new AbortController for each request to ensure uniqueness
      const controller = new AbortController();
      
      // Add artificial delay to make request more visible
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await UnicodeHelper.fetchWithUnicodeDecoding(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk',
          // Force unique headers to prevent caching
          'X-Request-ID': `req_${Date.now()}_${Math.random()}`,
          'X-DevTools-Visible': 'true',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: controller.signal,
        // Disable caching completely
        cache: 'no-store',
        body: JSON.stringify({
          data: {
            session_id: sessionId,
            prompt_data: promptData,
            // Add unique data to prevent request deduplication
            request_id: `${sessionId}_${Date.now()}_${Math.random()}`,
            timestamp: new Date().toISOString()
          },
        })
      });

      console.log('📡 Network request completed:', {
        url: url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        timestamp: new Date().toISOString()
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      // Log response details for debugging
      console.log('📡 Response details:', {
        hasBody: !!response.body,
        bodyUsed: response.bodyUsed,
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
        transferEncoding: response.headers.get('transfer-encoding')
      });

      return response;
    } catch (error) {
      console.error('❌ Error running super agent:', error);
      throw error;
    }
  }

  // NEW METHOD: Alternative method that goes through backend to ensure visibility
  async runSuperAgentViaBackend(sessionId: string, promptData: string): Promise<Response> {
    try {
      console.log('🚀 Making request to run_super_agent via backend:', {
        backendUrl: this.backendUrl,
        sessionId,
        promptData,
        timestamp: new Date().toISOString()
      });

      // Force network visibility through backend proxy
      const uniqueParam = `?_backend_proxy=${Date.now()}&_visible=${Math.random().toString(36)}`;
      const url = `${this.backendUrl}/api/v1/agents/run_super_agent${uniqueParam}`;

      const response = await UnicodeHelper.fetchWithUnicodeDecoding(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': `backend_req_${Date.now()}_${Math.random()}`,
          'X-DevTools-Visible': 'true',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        cache: 'no-store',
        body: JSON.stringify({
          data: {
            session_id: sessionId,
            prompt_data: promptData,
            request_id: `backend_${sessionId}_${Date.now()}_${Math.random()}`,
            timestamp: new Date().toISOString()
          },
        })
      });

      console.log('📡 Backend proxy request completed:', {
        url: url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('❌ Error running super agent via backend:', error);
      throw error;
    }
  }

  // Helper function to return raw response text
  private cleanResponseText(rawText: string): string {
    if (!rawText) return '';
    return rawText;
  }

  async processStreamingResponse(
    response: Response,
    onChunk?: (chunk: string) => void,
    onComplete?: (fullResponse: string) => void,
    onError?: (error: Error) => void
  ): Promise<string> {
    try {
      const reader = response.body?.getReader();
      if (!reader) {
        const errorMsg = 'Response body is not readable';
        console.error('❌', errorMsg);
        onError?.(new Error(errorMsg));
        throw new Error(errorMsg);
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';
      let hasReceivedData = false;

      console.log('📡 Starting to process NDJSON streaming response...');

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('📡 Stream reading completed');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        
        // Skip empty chunks
        if (!chunk || chunk.trim() === '') {
          continue;
        }

        // Add chunk to buffer
        buffer += chunk;
        
        // Process complete lines (NDJSON format)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            // Use UnicodeHelper to process the JSON line and decode Vietnamese characters
            const jsonData = UnicodeHelper.processStreamingJsonLine(line);
            
            if (!jsonData) {
              console.warn('⚠️ Failed to process JSON line');
              continue;
            }
            
            if (jsonData.response) {
              // Use properly decoded response text
              const rawResponseText = jsonData.response;
              
              if (rawResponseText) {
                fullResponse += rawResponseText;
                hasReceivedData = true;
                
                console.log('📊 Processed response chunk:', {
                  raw: rawResponseText.substring(0, 100) + (rawResponseText.length > 100 ? '...' : ''),
                  totalLength: fullResponse.length,
                  isProperlyEncoded: UnicodeHelper.isProperlyEncoded(rawResponseText)
                });
                
                // Send the properly decoded text chunk to the callback
                onChunk?.(rawResponseText);
              }
            } else {
              console.warn('⚠️ JSON object missing response field:', jsonData);
            }
          } catch (parseError) {
            console.error('❌ Failed to parse JSON line:', {
              line: line.substring(0, 100) + (line.length > 100 ? '...' : ''),
              error: parseError,
              lineLength: line.length
            });
            // Continue processing other lines even if one fails
          }
        }
      }

      // Check if we received any meaningful data
      if (!hasReceivedData || !fullResponse) {
        console.warn('⚠️ No meaningful data received from stream');
        const fallbackMessage = 'Xin lỗi, tôi không thể tạo phản hồi cho yêu cầu này. Vui lòng thử lại sau.';
        onComplete?.(fallbackMessage);
        return fallbackMessage;
      }

      // Ensure the final response is properly encoded
      const finalResponse = UnicodeHelper.ensureUtf8Encoding(fullResponse);
      console.log('✅ NDJSON streaming complete. Final response length:', finalResponse.length);
      console.log('✅ Final response preview:', finalResponse.substring(0, 200));
      console.log('✅ Final response properly encoded:', UnicodeHelper.isProperlyEncoded(finalResponse));
      
      onComplete?.(finalResponse);
      return finalResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown streaming error';
      console.error('❌ Error processing streaming response:', errorMessage);
      onError?.(error as Error);
      throw error;
    }
  }

  private safeStringify(obj: any): string {
    if (obj === null || obj === undefined) {
      return 'Không có thông tin';
    }
    
    if (typeof obj === 'string') {
      return obj;
    }
    
    if (typeof obj === 'object') {
      try {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
          return 'Không có thông tin chi tiết';
        }
        
        const formatted = keys.map(key => {
          const value = obj[key];
          if (typeof value === 'object' && value !== null) {
            return `${key}: ${JSON.stringify(value, null, 2)}`;
          }
          return `${key}: ${value}`;
        }).join('\n');
        
        return formatted;
      } catch (error) {
        console.error('Error stringifying object:', error);
        return 'Dữ liệu không hợp lệ';
      }
    }
    
    return String(obj);
  }

  async getAgentActivities(pageNumber: number = 1, pageSize: number = 30): Promise<AgentActivity[]> {
    try {
      const response = await fetch(
        `${appConfig.apiCorePrefix}/agent-activities/get-agent-activities?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
   
      let activities = [];
      if (data && data.data && data.data.items) {
        activities = data.data.items;
      } else {
        activities = data || [];
      }
      
      console.log('Raw activities from API:', activities);
      
      const processedActivities = activities.map((activity: any, index: number) => {
        console.log(`Processing activity ${index}:`, activity);
   
        let description = '';
        
        if (activity.description) {
          description = this.safeStringify(activity.description);
        } else if (activity.details) {
          description = this.safeStringify(activity.details);
        } else if (activity.message) {
          description = this.safeStringify(activity.message);
        } else if (activity.content) {
          description = this.safeStringify(activity.content);
        } else {
          description = 'Không có mô tả hoạt động';
        }
        
        const processedActivity = {
          ...activity,
          description,
          agentName: activity.agentName || activity.assigner || 'System',
          activityType: activity.activityType || activity.assignee || 'Activity',
          timestamp: activity.timestamp || activity.createdTime || new Date().toISOString()
        };
        
        console.log(`Processed activity ${index}:`, processedActivity);
        return processedActivity;
      });
      
      console.log('All processed activities:', processedActivities);
      return processedActivities;
    } catch (error) {
      console.error('Error fetching agent activities:', error);
      return [];
    }
  }

  async sendMessage(sessionId: string, message: string, agentId?: string): Promise<any> {
    try {
      const response = await BaseCoreService({
        method: 'POST',
        url: `${this.baseUrl}/agent-chat/send`,
        data: {
          sessionId,
          message,
          agentId,
        },
      });

      return this.processAIResponse(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async uploadImage(sessionId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sessionId', sessionId);

    try {
      const response = await BaseCoreService({
        method: 'POST',
        url: `${this.baseUrl}/agent-chat/upload-image`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data?.url || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  private processAIResponse(response: any): any {
    return response;
  }

  // Socket-based streaming methods for better network visibility
  private socket: any = null;

  connectSocket(): void {
    if (this.socket?.connected) {
      console.log('🔌 Socket already connected');
      return;
    }

    // Import socket.io-client dynamically to avoid SSR issues
    import('socket.io-client').then(({ io }) => {
      this.socket = io(this.backendUrl, {
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true
      });

      this.socket.on('connect', () => {
        console.log('🔌 Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('🔌 Socket connection error:', error);
      });
    });
  }

  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected manually');
    }
  }

  async streamRunSuperAgentSocket(
    sessionId: string,
    promptData: string,
    callbacks: {
      onStart?: (data: any) => void;
      onChunk?: (data: any) => void;
      onEnd?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        this.connectSocket();
        
        // Wait for connection before proceeding
        setTimeout(() => {
          this.streamRunSuperAgentSocket(sessionId, promptData, callbacks)
            .then(resolve)
            .catch(reject);
        }, 1000);
        return;
      }

      console.log('🚀 Starting socket stream for run_super_agent:', {
        sessionId,
        promptData,
        socketId: this.socket.id
      });

      // Set up event listeners
      const handleStart = (data: any) => {
        console.log('🚀 Socket stream started:', data);
        callbacks.onStart?.(data);
      };

      const handleChunk = (data: any) => {
        console.log('📊 Socket chunk received:', data);
        callbacks.onChunk?.(data);
      };

      const handleEnd = (data: any) => {
        console.log('✅ Socket stream ended:', data);
        callbacks.onEnd?.(data);
        cleanup();
        resolve();
      };

      const handleError = (error: any) => {
        console.error('❌ Socket stream error:', error);
        callbacks.onError?.(error);
        cleanup();
        reject(new Error(error.error || error.message || 'Socket stream error'));
      };

      const cleanup = () => {
        this.socket.off('stream_start', handleStart);
        this.socket.off('response_chunk', handleChunk);
        this.socket.off('stream_end', handleEnd);
        this.socket.off('stream_error', handleError);
      };

      // Register event listeners
      this.socket.on('stream_start', handleStart);
      this.socket.on('response_chunk', handleChunk);
      this.socket.on('stream_end', handleEnd);
      this.socket.on('stream_error', handleError);

      // Emit the request with unique identifiers for network visibility
      this.socket.emit('stream_run_super_agent', {
        sessionId: `${sessionId}_${Date.now()}`,
        promptData,
        requestId: `socket_req_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
      });
    });
  }

  async streamAgentActivities(
    pageNumber: number,
    pageSize: number,
    callbacks: {
      onStart?: (data: any) => void;
      onActivity?: (activity: any) => void;
      onEnd?: (data: any) => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        this.connectSocket();
        
        // Wait for connection before proceeding
        setTimeout(() => {
          this.streamAgentActivities(pageNumber, pageSize, callbacks)
            .then(resolve)
            .catch(reject);
        }, 1000);
        return;
      }

      console.log('🚀 Starting socket stream for agent activities:', {
        pageNumber,
        pageSize,
        socketId: this.socket.id
      });

      // Set up event listeners
      const handleStart = (data: any) => {
        console.log('🚀 Activities stream started:', data);
        callbacks.onStart?.(data);
      };

      const handleActivity = (activity: any) => {
        console.log('📊 Activity received:', activity);
        callbacks.onActivity?.(activity);
      };

      const handleEnd = (data: any) => {
        console.log('✅ Activities stream ended:', data);
        callbacks.onEnd?.(data);
        cleanup();
        resolve();
      };

      const handleError = (error: any) => {
        console.error('❌ Activities stream error:', error);
        callbacks.onError?.(error);
        cleanup();
        reject(new Error(error.error || error.message || 'Activities stream error'));
      };

      const cleanup = () => {
        this.socket.off('stream_start', handleStart);
        this.socket.off('activity_data', handleActivity);
        this.socket.off('stream_end', handleEnd);
        this.socket.off('stream_error', handleError);
      };

      // Register event listeners
      this.socket.on('stream_start', handleStart);
      this.socket.on('activity_data', handleActivity);
      this.socket.on('stream_end', handleEnd);
      this.socket.on('stream_error', handleError);

      // Emit the request
      this.socket.emit('stream_agent_activities', {
        pageNumber,
        pageSize,
        requestId: `activities_req_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
      });
    });
  }
}
