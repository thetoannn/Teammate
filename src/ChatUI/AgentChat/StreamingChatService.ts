import { StringHelper } from "../../helper/StringHelper";
import { UnicodeHelper } from "../../helper/UnicodeHelper";

export interface StreamingResponse {
  response?: string;
  message?: string;
  [key: string]: any;
  agent_name?: string;
}

export interface StreamingCallbacks {
  onChunk?: (chunk: string, variant: 'text' | 'canvas') => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

export class StreamingChatService {
  private static instance: StreamingChatService;
  private fallbackMessage = "Xin lỗi, tôi không thể tạo phản hồi cho yêu cầu này. Vui lòng thử lại sau.";
  private readonly authToken =
    "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk";

  public static getInstance(): StreamingChatService {
    if (!StreamingChatService.instance) {
      StreamingChatService.instance = new StreamingChatService();
    }
    return StreamingChatService.instance;
  }

  private getApiUrl(agentType?: string): string {
    // Map agent types to their corresponding API endpoints
    const agentEndpoints: { [key: string]: string } = {
      research: "https://agent.sieutho.vn/api/v1/market-research-agent/chat",
      "marketing-assistant":
        "https://agent.sieutho.vn/api/v1/agents/run_super_agent",
      // Add more agent mappings as needed
    };

    // Default to run_super_agent if no specific mapping found
    return (
      agentEndpoints[agentType || ""] ||
      "https://agent.sieutho.vn/api/v1/agents/run_super_agent"
    );
  }

  private cleanResponseText(rawText: string): string {
    // Return raw text with only basic space preservation
    if (!rawText) return "";
    return rawText;
  }

  async sendMessage(
    sessionId: string,
    message: string,
    callbacks: StreamingCallbacks = {},
    agentType?: string
  ): Promise<void> {
    try {
      const apiUrl = this.getApiUrl(agentType);

      console.log("🚀 StreamingChatService: Making API request", {
        sessionId,
        agentType,
        apiUrl,
        message:
          message.substring(0, 100) + (message.length > 100 ? "..." : ""),
        timestamp: new Date().toISOString(),
      });

      // Different request body structure for different agents
      let requestBody;
      if (agentType === "research") {
        // Research agent expects direct prompt_data field
        requestBody = {
          session_id: sessionId,
          prompt_data: message,
        };
      } else {
        // Marketing assistant expects nested data structure
        requestBody = {
          data: {
            session_id: sessionId,
            prompt_data: message,
          },
        };
      }

      const response = await UnicodeHelper.fetchWithUnicodeDecoding(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authToken,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 StreamingChatService: Response received", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get("content-type"),
      });

      if (!response.ok) {
        const errorText = await response.text();
        const error = new Error(
          `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
        console.error("❌ StreamingChatService: API error", error);
        callbacks.onError?.(error);
        throw error;
      }

      if (!response.body) {
        const error = new Error("No response body received");
        console.error("❌ StreamingChatService: No response body");
        callbacks.onError?.(error);
        throw error;
      }

      await this.processStreamingResponse(response, callbacks);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        "❌ StreamingChatService: Error in sendMessage",
        errorMessage
      );
      callbacks.onError?.(error as Error);
      throw error;
    }
  }

  private async processStreamingResponse(
    response: Response,
    callbacks: StreamingCallbacks
  ): Promise<void> {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');
    let hasReceivedData = false;
    let fullResponse = "";

    console.log("📊 StreamingChatService: Starting to process stream...");

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("✅ StreamingChatService: Stream reading completed");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });

        if (StringHelper.isEmpty(chunk)) {
          continue;
        }

        const lines = chunk.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          if (StringHelper.isEmpty(trimmedLine)) continue;
          
          try {
            console.log("🔄 StreamingChatService: Processing JSON line", trimmedLine);
            
            // Use UnicodeHelper to process the JSON line and decode Vietnamese characters
            const jsonData: StreamingResponse = UnicodeHelper.processStreamingJsonLine(trimmedLine);
            
            if (!jsonData) {
              console.warn("⚠️ StreamingChatService: Failed to process JSON line");
              continue;
            }

            const rawResponseText = jsonData.response || jsonData.message || "";
            const variant = jsonData.agent_name === 'report' ? 'canvas' : 'text';
            console.log("agent name", jsonData.agent_name, "variant", variant);

            if (rawResponseText) {
              hasReceivedData = true;
              fullResponse += rawResponseText;
              
              // Log the properly decoded text for debugging
              console.log("📝 StreamingChatService: Decoded Vietnamese text", {
                original: trimmedLine.substring(0, 100) + (trimmedLine.length > 100 ? "..." : ""),
                decoded: rawResponseText.substring(0, 100) + (rawResponseText.length > 100 ? "..." : ""),
                isProperlyEncoded: UnicodeHelper.isProperlyEncoded(rawResponseText)
              });
              
              callbacks.onChunk?.(rawResponseText, variant);
            } else {
              console.warn(
                "⚠️ StreamingChatService: JSON object missing response/message field",
                jsonData
              );
            }
          } catch (parseError) {
            console.error("❌ StreamingChatService: Failed to parse JSON line", {
              line: trimmedLine.substring(0, 100) + (trimmedLine.length > 100 ? "..." : ""),
              error: parseError,
              lineLength: trimmedLine.length,
            });
          }
        }
      }

      if (!hasReceivedData) {
        console.warn(
          "⚠️ StreamingChatService: No meaningful data received from stream"
        );
        callbacks.onComplete?.(this.fallbackMessage);
        return;
      }

      // Ensure the final response is properly encoded
      const finalResponse = UnicodeHelper.ensureUtf8Encoding(fullResponse);
      console.log("✅ StreamingChatService: Final response properly encoded", {
        length: finalResponse.length,
        preview: finalResponse.substring(0, 200),
        isProperlyEncoded: UnicodeHelper.isProperlyEncoded(finalResponse)
      });
      
      callbacks.onComplete?.(finalResponse);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown streaming error";
      console.error(
        "❌ StreamingChatService: Error processing stream",
        errorMessage
      );
      callbacks.onError?.(error as Error);
      throw error;
    }
  }
}
