import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import fetch from "node-fetch";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import aiAgentRoutes from "./routes/aiAgentDynamic.js";
import agentActivitiesRoutes from "./routes/agentActivities.js";

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Bearer token for API authentication from environment variables
const BEARER_TOKEN =
  process.env.BEARER_TOKEN ||
  "Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImM1YWQxODNmLTQ0ZGEtNDBkMi05NGQwLWJjOTZhYjY2YWU3MCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImxxdHVhbnRrMTkiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibHF0dWFudGsxOSIsImV4cCI6MTc1NTMxNDUzMiwiaXNzIjoiaHR0cHM6Ly9wZXJmZXguYWkiLCJhdWQiOiJodHRwczovL2FwcC5wZXJmZXguYWkifQ.PaYtSfnxY2ajgzsYevfWAeUD3HpwSR8fEvbhqkFKbCk";

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "*.google.com",
          "*.googleusercontent.com",
        ],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://api.nhansuso.vn",
          "https://agent.sieutho.vn",
          "wss:",
          "ws:",
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'", "https://accounts.google.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration - Accept all origins
const corsOptions = {
  origin: "*", // Allow all origins
  credentials: false, // Must be false when origin is "*"
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parsing middleware
app.use(cookieParser());

// Trust proxy for rate limiting behind reverse proxy
app.set("trust proxy", 1);

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/v1/agents", aiAgentRoutes);
app.use("/api/agent-activities", agentActivitiesRoutes);

// Token overview proxy route to handle 400 errors properly
app.get("/api/users/tokens/overview", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        data: null,
        code: 1,
        message: "Authorization header required",
      });
    }

    // Forward the request to the external API
    const response = await fetch(
      "https://api.nhansuso.vn/api/users/tokens/overview?" +
        new URLSearchParams(req.query),
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    // If it's a 400 error with USER_TOKEN_BALANCE_NOT_FOUND, convert to success with default values
    if (
      response.status === 400 &&
      data.message === "USER_TOKEN_BALANCE_NOT_FOUND"
    ) {
      const defaultData = {
        totalPointPurchased: 0,
        totalPointUsed: 0,
        totalPointBalance: 0,
        lastPurchasedDate: new Date().toISOString(),
        lastUsedDate: new Date().toISOString(),
        lastBalanceUpdateDate: new Date().toISOString(),
      };

      return res.status(200).json({
        data: defaultData,
        code: 0,
        message: "Success - New user with default values",
      });
    }

    // For all other cases, return the original response
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error proxying token overview request:", error);
    res.status(500).json({
      data: null,
      code: 1,
      message: "Internal server error",
    });
  }
});

app.get("/api/agents/capabilities", (req, res) => {
  const agentRoles = {
    marketing_manager: {
      name: "Marketing Manager AI Agent",
      description: "Trưởng phòng Marketing",
      responsibilities: [
        "Nhận yêu cầu từ CEO",
        "Phân rã & giao nhiệm vụ cho các AI",
        "Tổng hợp kế hoạch, báo cáo, theo dõi KPI",
      ],
    },
    research_agent: {
      name: "Market Research AI Agent",
      description: "Phân tích thị trường & đối thủ",
    },
    strategy_agent: {
      name: "Strategy AI Agent",
      description: "Chiến lược truyền thông – bán hàng",
    },
    content_agent: {
      name: "Content AI Agent",
      description: "Sáng tạo nội dung truyền thông & chuẩn SEO",
    },
    media_agent: {
      name: "Media AI Agent",
      description: "Thiết kế hình ảnh & video truyền thông",
    },
    ad_agent: {
      name: "Ads AI Agent",
      description: "Quản lý quảng cáo đa nền tảng",
    },
    report_agent: {
      name: "Report AI Agent",
      description: "Phân tích hiệu quả & báo cáo chiến dịch",
    },
  };

  res.json({
    success: true,
    data: {
      agents: agentRoles,
      totalAgents: Object.keys(agentRoles).length,
    },
  });
});

app.get("/", (req, res) => {
  res.send("Teammate backend is running with dynamic AI agents!");
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  // Handle run_super_agent streaming
  socket.on("stream_run_super_agent", async (data) => {
    try {
      const {
        sessionId = "default-session",
        promptData = "Show me agent activities",
      } = data || {};

      console.log("📡 Streaming run_super_agent:", { sessionId, promptData });

      // Call the run_super_agent API
      const response = await fetch(
        "https://agent.sieutho.vn/api/v1/agents/run_super_agent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: BEARER_TOKEN,
          },
          body: JSON.stringify({
            data: {
              session_id: sessionId,
              prompt_data: promptData,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Signal start of stream
      socket.emit("stream_start", {
        sessionId,
        promptData,
        timestamp: new Date().toISOString(),
      });

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;

          console.log("📊 Streaming chunk:", chunk);

          // Emit each chunk
          socket.emit("response_chunk", {
            chunk: chunk,
            timestamp: new Date().toISOString(),
          });
        }
      } finally {
        reader.releaseLock();
      }

      // Signal end of stream
      socket.emit("stream_end", {
        message: "AI response streaming completed",
        fullResponse: fullResponse,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error streaming run_super_agent:", error);
      socket.emit("stream_error", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle agent activities streaming
  socket.on("stream_agent_activities", async (data) => {
    try {
      const { pageNumber = 1, pageSize = 30 } = data || {};

      console.log("📡 Streaming agent activities:", { pageNumber, pageSize });

      // Fetch data from the API
      const response = await fetch(
        `https://api.nhansuso.vn/api/agent-activities/get-agent-activities?PageNumber=${pageNumber}&PageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            Authorization: BEARER_TOKEN,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const apiData = await response.json();
      const activities = apiData.data?.items || apiData || [];

      // Stream activities one by one
      socket.emit("stream_start", {
        total: activities.length,
        pageNumber,
        pageSize,
      });

      for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];

        // Process and format activity data
        const formattedActivity = {
          id: activity.id || `activity-${Date.now()}-${i}`,
          name: activity.name || activity.title || "Activity",
          description:
            activity.description || activity.content || "No description",
          assigner: activity.assigner || activity.sender || "System",
          assignee: activity.assignee || activity.recipient || "Agent",
          createdTime:
            activity.createdTime ||
            activity.timestamp ||
            new Date().toISOString(),
          status: activity.status || "active",
          type: activity.type || "text",
          index: i + 1,
        };

        // Emit each activity with a small delay to simulate streaming
        setTimeout(() => {
          socket.emit("activity_data", formattedActivity);
        }, i * 100); // 100ms delay between each activity
      }

      // Signal end of stream
      setTimeout(() => {
        socket.emit("stream_end", {
          message: "All activities streamed successfully",
          total: activities.length,
        });
      }, activities.length * 100 + 500);
    } catch (error) {
      console.error("❌ Error streaming agent activities:", error);
      socket.emit("stream_error", {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT;

if (PORT) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔌 Socket.io server ready for connections`);
    console.log(
      `📡 External API integration: ${
        process.env.AGENT_API_URL || "https://agent.sieutho.vn"
      }/api/v1/agents/run_super_agent`
    );
    console.log(
      `🌐 Frontend URL: ${
        process.env.FRONTEND_URL || "https://teammate.nhansuso.vn"
      }`
    );
    console.log(
      `🔗 API Base URL: ${
        process.env.API_BASE_URL || "https://api.nhansuso.vn"
      }`
    );
  });
} else {
  console.log(
    "⚠️  No PORT specified in environment variables. Server not started."
  );
  console.log("🔧 Please set PORT in your .env file or environment variables.");
}
