import React, { useState } from "react";
import { AgentChatService } from "../ChatUI/AgentChat/AgentChatService";
import { AgentActivity } from "../ChatUI/AgentChat/AgentChatTypes";

const SocketStreamDemo: React.FC = () => {
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStatus, setStreamStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isTestingAI, setIsTestingAI] = useState(false);

  const chatService = AgentChatService.getInstance();

  const startStreaming = async () => {
    setIsStreaming(true);
    setActivities([]);
    setError("");
    setStreamStatus("Connecting to socket...");

    try {
      await chatService.streamAgentActivities(1, 30, {
        onStart: (data) => {
          setStreamStatus(`Stream started - Total activities: ${data.total}`);
          console.log("🚀 Stream started:", data);
        },
        onActivity: (activity) => {
          setActivities((prev) => [...prev, activity]);
          setStreamStatus(`Received ${activities.length + 1} activities...`);
          console.log("📊 Activity received:", activity);
        },
        onEnd: (data) => {
          setStreamStatus(
            `Stream completed - ${data.total} activities received`
          );
          setIsStreaming(false);
          console.log("✅ Stream ended:", data);
        },
        onError: (error) => {
          setError(
            `Stream error: ${error.error || error.message || "Unknown error"}`
          );
          setIsStreaming(false);
          setStreamStatus("Stream failed");
          console.error("❌ Stream error:", error);
        },
      });
    } catch (err: any) {
      setError(`Connection error: ${err.message}`);
      setIsStreaming(false);
      setStreamStatus("Connection failed");
    }
  };

  const testRunSuperAgent = async () => {
    setIsTestingAI(true);
    setAiResponse("");
    setError("");

    try {
      console.log("🧪 Testing run_super_agent network visibility...");
      const response = await chatService.runSuperAgent(
        "test-session-123",
        "Hello, show me agent activities"
      );

      // Process the streaming response
      const fullResponse = await chatService.processStreamingResponse(
        response,
        (chunk) => {
          console.log("📊 Received chunk:", chunk);
          setAiResponse((prev) => prev + chunk);
        },
        (fullResponse) => {
          console.log("✅ Full response received:", fullResponse);
          setIsTestingAI(false);
        },
        (error) => {
          console.error("❌ Streaming error:", error);
          setError(`Streaming error: ${error.message}`);
          setIsTestingAI(false);
        }
      );
    } catch (err: any) {
      setError(`AI Test error: ${err.message}`);
      setIsTestingAI(false);
      console.error("❌ Test failed:", err);
    }
  };

  const testRunSuperAgentSocket = async () => {
    setIsTestingAI(true);
    setAiResponse("");
    setError("");

    try {
      console.log("🧪 Testing run_super_agent via socket...");
      await chatService.streamRunSuperAgentSocket(
        "test-session-123",
        "Hello, show me agent activities",
        {
          onStart: (data) => {
            console.log("🚀 Socket AI stream started:", data);
            setAiResponse("🔄 Starting AI response...\n");
          },
          onChunk: (chunk) => {
            console.log("📊 Socket AI chunk received:", chunk);
            setAiResponse((prev) => prev + chunk.chunk);
          },
          onEnd: (data) => {
            console.log("✅ Socket AI stream ended:", data);
            setIsTestingAI(false);
          },
          onError: (error) => {
            console.error("❌ Socket AI stream error:", error);
            setError(`Socket AI error: ${error.error || error.message}`);
            setIsTestingAI(false);
          },
        }
      );
    } catch (err: any) {
      setError(`Socket AI Test error: ${err.message}`);
      setIsTestingAI(false);
      console.error("❌ Socket AI test failed:", err);
    }
  };

  const stopStreaming = () => {
    chatService.disconnectSocket();
    setIsStreaming(false);
    setStreamStatus("Stream stopped");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Network & Socket Demo</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Agent Test Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">
            🤖 AI Agent Test (Network Visibility)
          </h3>

          <div className="mb-4 flex gap-2">
            <button
              onClick={testRunSuperAgent}
              disabled={isTestingAI}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isTestingAI ? "Testing AI..." : "Test Direct API"}
            </button>
            <button
              onClick={testRunSuperAgentSocket}
              disabled={isTestingAI}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
            >
              {isTestingAI ? "Testing AI..." : "Test Socket API"}
            </button>
          </div>

          <div className="border rounded p-3 bg-gray-50 max-h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">AI Response:</h4>
            {aiResponse ? (
              <pre className="text-sm whitespace-pre-wrap">{aiResponse}</pre>
            ) : (
              <p className="text-gray-500 italic">No response yet...</p>
            )}
          </div>

          <div className="mt-2 text-xs text-blue-600">
            <p>
              ✅ Check Network tab for:
              https://teammate.nhansuso.vn/api/v1/agents/run_super_agent
            </p>
            <p>
              ✅ Backend will call:
              https://agent.sieutho.vn/api/v1/agents/run_super_agent
            </p>
          </div>
        </div>

        {/* Socket Stream Section */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">🔌 Socket Stream Test</h3>

          <div className="mb-4 flex gap-2">
            <button
              onClick={startStreaming}
              disabled={isStreaming}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isStreaming ? "Streaming..." : "Start Stream"}
            </button>

            <button
              onClick={stopStreaming}
              disabled={!isStreaming}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              Stop Stream
            </button>
          </div>

          <div className="mb-2">
            <div className="text-sm text-gray-600">
              Status: <span className="font-medium">{streamStatus}</span>
            </div>
          </div>

          <div className="border rounded p-3 bg-gray-50 max-h-64 overflow-y-auto">
            <h4 className="font-medium mb-2">
              Activities ({activities.length})
            </h4>

            {activities.length === 0 ? (
              <p className="text-gray-500 italic">
                No activities received yet...
              </p>
            ) : (
              <div className="space-y-2">
                {activities.slice(-5).map((activity, index) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-blue-400 pl-2 py-1 bg-white rounded text-xs"
                  >
                    <div className="font-medium">{activity.agentName}</div>
                    <div className="text-gray-600 truncate">
                      {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 text-xs text-blue-600">
            <p>✅ Socket connects to: https://teammate.nhansuso.vn</p>
            <p>
              ✅ Streams from:
              https://api.nhansuso.vn/api/agent-activities/get-agent-activities
            </p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">
          🔍 How to Test Network Visibility:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Open browser DevTools (F12)</li>
          <li>2. Go to Network tab</li>
          <li>3. Click "Test run_super_agent" button</li>
          <li>4. Look for network requests in the Network tab</li>
          <li>5. You should see both backend and external API calls</li>
          <li>6. Click "Start Stream" to test socket functionality</li>
        </ol>
      </div>
    </div>
  );
};

export default SocketStreamDemo;
