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

const agentRoles = {
  marketing_manager: {
    name: "Marketing Manager AI Agent",
    description: "Trưởng phòng Marketing",
    responsibilities: [
      "Nhận yêu cầu từ CEO",
      "Phân rã & giao nhiệm vụ cho các AI",
      "Tổng hợp kế hoạch, báo cáo, theo dõi KPI",
      "Xin phép duyệt ngân sách hoặc tạm dừng chiến dịch",
    ],
    personality:
      "Phong cách: Lịch sự, chuyên nghiệp, ngắn gọn, rõ ràng như trưởng phòng thực thụ",
  },
  research_agent: {
    name: "Market Research AI Agent",
    description: "Phân tích thị trường & đối thủ",
    responsibilities: [
      "Phân tích thị trường, hành vi khách hàng, từ khóa, sản phẩm cạnh tranh",
      "Tìm insight nền tảng (Facebook, TikTok, Google, Shopee...)",
    ],
  },
  strategy_agent: {
    name: "Strategy AI Agent",
    description: "Chiến lược truyền thông – bán hàng",
    responsibilities: [
      "Lập chiến lược tổng thể cho chiến dịch Branding hoặc Bán hàng",
      "Xác định nền tảng, đối tượng mục tiêu, KPIs, ngân sách và phân bổ nguồn lực",
    ],
  },
  content_agent: {
    name: "Content AI Agent",
    description: "Sáng tạo nội dung truyền thông & chuẩn SEO",
    responsibilities: [
      "Viết nội dung truyền thông đa nền tảng: Facebook, TikTok, Zalo, Email, Website...",
      "Soạn caption, mô tả video, nội dung website, kịch bản video, email, thông điệp",
      "Viết nội dung chuẩn SEO cho website/blog",
    ],
  },
  media_agent: {
    name: "Media AI Agent",
    description: "Thiết kế hình ảnh & video truyền thông",
    responsibilities: [
      "Tạo ảnh, video, banner, poster, animation... phục vụ truyền thông đa nền tảng",
      "Tạo visual cho quảng cáo, bài post, landing page, email, sản phẩm",
    ],
  },
  ad_agent: {
    name: "Ads AI Agent",
    description: "Quản lý quảng cáo đa nền tảng",
    responsibilities: [
      "Thiết lập & triển khai chiến dịch quảng cáo trên Facebook, TikTok, Google…",
      "Theo dõi hiệu quả, A/B test, điều chỉnh khi cần",
      "Gửi cảnh báo khi vượt ngưỡng ngân sách hoặc ROAS kém",
    ],
  },
  report_agent: {
    name: "Report AI Agent",
    description: "Phân tích hiệu quả & báo cáo chiến dịch",
    responsibilities: [
      "Thu thập, tổng hợp dữ liệu từ các chiến dịch Marketing",
      "Đánh giá hiệu suất: CPC, CPM, CTR, ROAS, số đơn, tỷ lệ chốt…",
      "Phân tích xu hướng & đề xuất cải tiến",
    ],
  },
};

const toolNameMap = {
  web_deep_search: "Tìm kiếm web sâu",
  web_lastest_search: "Tìm kiếm web mới nhất",
  get_branding_info: "Lấy thông tin thương hiệu",
  get_product_list: "Lấy danh sách sản phẩm",
  edit_image: "Chỉnh sửa ảnh",
  get_current_time: "Lấy thời gian hiện tại",
  post_to_facebook: "Đăng lên Facebook",
  advertise_account: "Quản lý tài khoản quảng cáo",
  get_facebook_ads_list: "Lấy danh sách quảng cáo Facebook",
  update_ad_status: "Cập nhật trạng thái quảng cáo",
  create_campaign: "Tạo chiến dịch",
  create_creative: "Tạo vật lý",
  create_ad: "Tạo quảng cáo",
  create_fb_adset: "Tạo tập quảng cáo",
  get_fanpage_account: "Lấy danh sách tài khoản fanpage",
};

function formatActivityForDisplay(activity) {
  console.log("Formatting activity:", activity);

  const safeStringify = (obj) => {
    if (obj === null || obj === undefined) return "Không có thông tin";
    if (typeof obj === "string") return obj;
    if (typeof obj === "object") {
      try {
        return JSON.stringify(obj, null, 2);
      } catch (e) {
        return "Dữ liệu không hợp lệ";
      }
    }
    return String(obj);
  };

  return {
    id: activity.id || `activity-${Date.now()}-${Math.random()}`,
    title: activity.name || activity.title || "Hoạt động",
    description: safeStringify(
      activity.description || activity.details || activity.content
    ),
    assigner: activity.assigner || "Hệ thống",
    assignee: toolNameMap[activity.assignee] || activity.assignee || "AI Agent",
    timestamp:
      activity.createdTime || activity.timestamp || new Date().toISOString(),
    status: activity.status || "active",
  };
}

function generateDynamicResponse(activities, userQuery) {
  console.log("Generating dynamic response for:", userQuery);
  console.log("Activities received:", activities);

  if (!activities || activities.length === 0) {
    return {
      message:
        "📊 Hiện tại chưa có hoạt động nào được ghi nhận. Các AI Agent đang sẵn sàng để hỗ trợ bạn.",
      type: "empty",
      activities: [],
    };
  }

  const query = userQuery.toLowerCase().trim();

  let filteredActivities = activities;
  let contextMessage = "📊 **Tất cả hoạt động**";

  const agentMention = Object.keys(agentRoles).find(
    (agent) =>
      query.includes(agent.replace("_", " ")) ||
      query.includes(agentRoles[agent].name.toLowerCase())
  );

  if (agentMention) {
    filteredActivities = activities.filter(
      (activity) =>
        (activity.assigner?.toLowerCase() || "").includes(agentMention) ||
        (activity.assignee?.toLowerCase() || "").includes(agentMention)
    );
    contextMessage = `🎯 **Hoạt động của ${agentRoles[agentMention].name}**`;
  }

  const taskKeywords = {
    "quảng cáo": ["ads", "campaign", "facebook", "marketing"],
    "nội dung": ["content", "caption", "post", "write"],
    "nghiên cứu": ["research", "analysis", "market", "competitor"],
    "báo cáo": ["report", "analytics", "performance", "kpi"],
    "thiết kế": ["media", "design", "image", "video", "banner"],
  };

  for (const [taskType, keywords] of Object.entries(taskKeywords)) {
    if (keywords.some((keyword) => query.includes(keyword))) {
      filteredActivities = filteredActivities.filter(
        (activity) =>
          (activity.description?.toLowerCase() || "").includes(taskType) ||
          keywords.some((keyword) =>
            (activity.description?.toLowerCase() || "").includes(keyword)
          )
      );
      contextMessage = `🎯 **Hoạt động liên quan đến ${taskType}**`;
      break;
    }
  }

  if (query.includes("tạo chiến dịch") || query.includes("tao chien dich")) {
    return {
      message:
        "🎯 **Tạo chiến dịch quảng cáo mới**\n\nDạ vâng Sếp. Để bắt đầu tạo chiến dịch quảng cáo, Sếp vui lòng cho em biết mục tiêu của chiến dịch lần này là gì ạ?\n\n1. Tăng tin nhắn (Messenger)\n2. Tăng lượt truy cập & mua hàng trên Landing Page (Chuyển đổi)\n3. Tăng lượt thích trang (Page Likes)",
      type: "campaign_creation",
      activities: [],
    };
  }

  if (
    query.includes("alo") ||
    query.includes("hello") ||
    query.includes("xin chào")
  ) {
    return {
      message: "Dạ em nghe Sếp ơi. Sếp cần em hỗ trợ công việc gì tiếp theo ạ?",
      type: "greeting",
      activities: [],
    };
  }

  const displayActivities = filteredActivities.slice(0, 15);

  return {
    message: `${contextMessage}\n\n💡 **Dựa trên yêu cầu của bạn:** "${userQuery}"\n📊 **Hiển thị ${displayActivities.length} hoạt động**`,
    type: "dynamic",
    activities: displayActivities.map(formatActivityForDisplay),
  };
}

router.post("/run_super_agent", async (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson");

  try {
    // Check if request is coming from the authorized URL
    const referer = req.get("Referer") || req.get("Origin") || "";
    const allowedUrl = "http://localhost:5173/chat?agent=marketing-assistant";

    console.log("🔍 Checking access restriction:", {
      referer,
      allowedUrl,
      isAuthorized:
        referer.includes("localhost:5173/chat") &&
        referer.includes("agent=marketing-assistant"),
    });

    // Validate that the request comes from the marketing-assistant agent page
    if (
      !referer.includes("localhost:5173/chat") ||
      !referer.includes("agent=marketing-assistant")
    ) {
      console.log("❌ Unauthorized access attempt from:", referer);

      res.status(403).write(
        JSON.stringify({
          message:
            "❌ Access Denied: This endpoint can only be accessed from the marketing-assistant agent page at http://localhost:5173/chat?agent=marketing-assistant",
          type: "error",
          code: "UNAUTHORIZED_ACCESS",
        }) + "\n"
      );
      res.end();
      return;
    }

    const { data } = req.body;
    const promptData = data?.prompt_data || "Show me agent activities";
    const sessionId = data?.session_id || "default";

    console.log("🎯 Processing authorized prompt:", promptData);

    // Call the actual agent.sieutho.vn API
    let apiResponse = await fetch(
      "https://agent.sieutho.vn/api/v1/agents/run_super_agent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          data: {
            session_id: sessionId,
            prompt_data: promptData,
          },
        }),
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`External API failed with status ${apiResponse.status}`);
    }

    // Stream the response back to the client
    const reader = apiResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.write(
      JSON.stringify({
        message: `❌ Lỗi: ${error.message || "Lỗi không xác định"}`,
        type: "error",
      }) + "\n"
    );
    res.end();
  }
});

router.post("/query-agent", async (req, res) => {
  try {
    const { agent, query, context } = req.body;

    if (!agentRoles[agent]) {
      return res.status(400).json({
        success: false,
        error: `Agent ${agent} không tồn tại`,
      });
    }

    const response = {
      agent: agentRoles[agent],
      query: query,
      response: `Tôi là ${agentRoles[agent].name}. ${
        agentRoles[agent].description
      }. Với câu hỏi "${query}", tôi có thể giúp bạn với: ${agentRoles[
        agent
      ].responsibilities.join(", ")}`,
      context: context || "general",
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("❌ Error in query-agent:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/agent-capabilities", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        agents: agentRoles,
        tools: toolNameMap,
        totalAgents: Object.keys(agentRoles).length,
        totalTools: Object.keys(toolNameMap).length,
      },
    });
  } catch (error) {
    console.error("❌ Error in agent-capabilities:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
