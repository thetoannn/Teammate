import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Updated Bearer token from login API
const BEARER_TOKEN =
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

router.get("/get-agent-activities", async (req, res) => {
  try {
    const { PageNumber = 1, PageSize = 30 } = req.query;

    let currentToken = BEARER_TOKEN;

    // First attempt with current token
    let apiResponse = await fetch(
      `https://api.nhansuso.vn/api/agent-activities/get-agent-activities?PageNumber=${PageNumber}&PageSize=${PageSize}`,
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
          `https://api.nhansuso.vn/api/agent-activities/get-agent-activities?PageNumber=${PageNumber}&PageSize=${PageSize}`,
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

    const data = await apiResponse.json();
    console.log("✅ Successfully fetched agent activities:", data);

    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching agent activities:", error.message);

    // Return empty data structure on error
    res.status(500).json({
      data: {
        items: [],
        totalCount: 0,
        pageNumber: parseInt(req.query.PageNumber) || 1,
        pageSize: parseInt(req.query.PageSize) || 30,
        totalPages: 0,
      },
      error: error.message,
    });
  }
});

export default router;
