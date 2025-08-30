async function testAPI() {
  try {
    console.log("🚀 Testing API call...");

    const response = await fetch(
      "https://agent.sieutho.vn/api/v1/agents/run_super_agent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk",
        },
        body: JSON.stringify({
          data: {
            session_id: "test-session",
            prompt_data: "Hello test",
          },
        }),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", errorText);
      return;
    }

    // Check if it's a streaming response
    const contentType = response.headers.get("content-type");
    console.log("📡 Content-Type:", contentType);

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      console.log("📊 Starting to read stream...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log("✅ Stream reading completed");
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        console.log("📊 Received chunk:", {
          length: chunk.length,
          content: chunk.substring(0, 200) + (chunk.length > 200 ? "..." : ""),
        });
      }

      console.log("✅ Full response length:", fullResponse.length);
      console.log("✅ Full response preview:", fullResponse.substring(0, 500));
    } else {
      console.log("❌ No response body");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();
