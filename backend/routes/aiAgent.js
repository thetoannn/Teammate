import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Updated Bearer token from login API
const BEARER_TOKEN =
  process.env.BEARER_TOKEN ||
  "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk";

// Login credentials for token refresh
const LOGIN_CREDENTIALS = {
  username: "lqtuantk19",
  password: "abc12345",
};

// Function to refresh the Bearer token
async function refreshBearerToken() {
  try {
    const response = await fetch("https://api.nhansuso.vn/api/accounts/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify(LOGIN_CREDENTIALS),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }

    const data = await response.json();
    if (data.code === 0 && data.data) {
      return `Bearer ${data.data}`;
    } else {
      throw new Error("Invalid login response");
    }
  } catch (error) {
    console.error("❌ Error refreshing token:", error.message);
    throw error;
  }
}

const API_BASE_URL = process.env.API_BASE_URL || "https://api.nhansuso.vn";

const keywordMapping = {
  "quảng cáo": ["quảng cáo", "marketing", "ad", "campaign", "facebook ads"],
  giày: ["giày", "sneaker", "footwear", "shoe"],
  facebook: ["facebook", "fb", "meta"],
  tạo: ["tạo", "create", "setup", "new"],
  "cập nhật": ["cập nhật", "update", "modify", "edit"],
  "báo cáo": ["báo cáo", "report", "analytics"],
  "chiến dịch": ["chiến dịch", "campaign"],
  agent: ["agent", "ai", "bot"],
  "hoạt động": ["hoạt động", "activity", "log"],
};

const genericQueries = [
  "show me agent activities",
  "hi",
  "hello",
  "xin chào",
  "tất cả",
  "all",
  "help",
  "hỗ trợ",
  "alo",
  "kaka",
];

router.post("/run_super_agent", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson");

  try {
    const { data } = req.body;
    const promptData = data?.prompt_data || "Show me agent activities";
    const sessionId = data?.session_id || "default";

    console.log("🎯 Processing prompt:", promptData);

    let currentToken = BEARER_TOKEN;

    // First attempt with current token
    let apiResponse = await fetch(
      `${API_BASE_URL}/api/agent-activities/get-agent-activities`,
      {
        headers: {
          Authorization: currentToken,
          Accept: "application/json",
        },
      }
    );

    // If unauthorized, try to refresh token and retry
    if (apiResponse.status === 401) {
      console.log("🔄 Token expired, refreshing...");
      try {
        currentToken = await refreshBearerToken();
        console.log("✅ Token refreshed successfully");

        // Retry with new token
        apiResponse = await fetch(
          `${API_BASE_URL}/api/agent-activities/get-agent-activities`,
          {
            headers: {
              Authorization: currentToken,
              Accept: "application/json",
            },
          }
        );
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.message);
        throw new Error(`Authentication failed: ${refreshError.message}`);
      }
    }

    if (!apiResponse.ok) {
      throw new Error(`External API failed with status ${apiResponse.status}`);
    }

    const json = await apiResponse.json();
    const items = json.data?.items || json || [];

    const activities = items.map((item) => ({
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
      name: item.name || item.title || "Activity",
      description: item.description || item.content || "No description",
      assigner: item.assigner || item.sender || "System",
      assignee: item.assignee || item.recipient || "Agent",
      createdTime:
        item.createdTime || item.timestamp || new Date().toISOString(),
      status: item.status || "active",
      type: item.type || "text",
    }));

    const userQuestion = promptData.toLowerCase().trim();

    const isGenericQuery = genericQueries.some(
      (query) => userQuestion.includes(query) || userQuestion === query
    );

    let filteredActivities = activities;
    let context = "📋 **All activities**";

    if (!isGenericQuery) {
      const matchedKeywords = Object.keys(keywordMapping).find((key) =>
        keywordMapping[key].some((kw) => userQuestion.includes(kw))
      );

      if (matchedKeywords) {
        filteredActivities = activities.filter((activity) => {
          const searchText =
            `${activity.name} ${activity.description}`.toLowerCase();
          return keywordMapping[matchedKeywords].some((kw) =>
            searchText.includes(kw)
          );
        });
        context = `🎯 **${matchedKeywords} activities**`;
      } else {
        const searchTerms = userQuestion
          .split(" ")
          .filter((term) => term.length > 2);
        filteredActivities = activities.filter((activity) => {
          const searchText =
            `${activity.name} ${activity.description}`.toLowerCase();
          return searchTerms.some((term) => searchText.includes(term));
        });

        if (filteredActivities.length === 0) {
          filteredActivities = activities.slice(0, 10);
          context = "📋 **Recent activities**";
        } else {
          context = `🔍 **Activities matching "${promptData}"**`;
        }
      }
    }

    const displayActivities = filteredActivities.slice(0, 15);

    res.write(
      JSON.stringify({
        message: `${context}\n\n💡 **Your question:** "${promptData}"\n📊 **Showing ${displayActivities.length} of ${activities.length} activities**`,
        type: "summary",
      }) + "\n"
    );

    displayActivities.forEach((activity, index) => {
      const message = {
        id: activity.id,
        title: activity.name,
        description: activity.description,
        assigner: activity.assigner,
        assignee: activity.assignee,
        timestamp: activity.createdTime,
        status: activity.status,
        index: index + 1,
      };

      res.write(JSON.stringify({ message, type: "activity" }) + "\n");
    });

    res.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.write(
      JSON.stringify({
        message: `❌ Error: ${error.message || "Unknown error"}`,
        type: "error",
      }) + "\n"
    );
    res.end();
  }
});

router.post("/query-activities", async (req, res) => {
  try {
    const {
      query,
      filters = {},
      pagination = { page: 1, size: 30 },
    } = req.body;

    let currentToken = BEARER_TOKEN;

    // First attempt with current token
    let apiResponse = await fetch(
      `${API_BASE_URL}/api/agent-activities/get-agent-activities?PageNumber=${pagination.page}&PageSize=${pagination.size}`,
      {
        headers: {
          Authorization: currentToken,
          Accept: "application/json",
        },
      }
    );

    // If unauthorized, try to refresh token and retry
    if (apiResponse.status === 401) {
      console.log("🔄 Token expired, refreshing...");
      try {
        currentToken = await refreshBearerToken();
        console.log("✅ Token refreshed successfully");

        // Retry with new token
        apiResponse = await fetch(
          `${API_BASE_URL}/api/agent-activities/get-agent-activities?PageNumber=${pagination.page}&PageSize=${pagination.size}`,
          {
            headers: {
              Authorization: currentToken,
              Accept: "application/json",
            },
          }
        );
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError.message);
        throw new Error(`Authentication failed: ${refreshError.message}`);
      }
    }

    if (!apiResponse.ok) {
      throw new Error(`External API failed with status ${apiResponse.status}`);
    }

    const json = await apiResponse.json();
    const items = json.data?.items || json || [];

    let filteredItems = items;

    if (query && query.trim()) {
      const searchTerms = query
        .toLowerCase()
        .split(" ")
        .filter((term) => term.length > 2);
      filteredItems = items.filter((item) => {
        const searchableText = `${item.name || ""} ${item.description || ""} ${
          item.assigner || ""
        } ${item.assignee || ""}`.toLowerCase();
        return searchTerms.some((term) => searchableText.includes(term));
      });
    }

    if (filters.status) {
      filteredItems = filteredItems.filter(
        (item) =>
          (item.status || "").toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.agent) {
      filteredItems = filteredItems.filter(
        (item) =>
          (item.assigner || "")
            .toLowerCase()
            .includes(filters.agent.toLowerCase()) ||
          (item.assignee || "")
            .toLowerCase()
            .includes(filters.agent.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: {
        items: filteredItems,
        totalCount: filteredItems.length,
        page: pagination.page,
        size: pagination.size,
      },
    });
  } catch (error) {
    console.error("❌ Error in query-activities:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
