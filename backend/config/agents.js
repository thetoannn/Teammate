export const agentRoles = {
  marketing_manager: {
    id: "marketing_manager",
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
    inputs: ["Brief từ CEO", "Kết quả từ các AI Agent khác"],
    outputs: ["Bản kế hoạch truyền thông", "Báo cáo KPI", "Lệnh triển khai"],
  },
  research_agent: {
    id: "research_agent",
    name: "Market Research AI Agent",
    description: "Phân tích thị trường & đối thủ",
    responsibilities: [
      "Phân tích thị trường, hành vi khách hàng, từ khóa, sản phẩm cạnh tranh",
      "Tìm insight nền tảng (Facebook, TikTok, Google, Shopee...)",
    ],
    inputs: ["Brief từ Marketing Manager", "Sản phẩm cần nghiên cứu"],
    outputs: [
      "Báo cáo nghiên cứu thị trường",
      "Insight khách hàng",
      "Phân tích đối thủ",
    ],
  },
  strategy_agent: {
    id: "strategy_agent",
    name: "Strategy AI Agent",
    description: "Chiến lược truyền thông – bán hàng",
    responsibilities: [
      "Lập chiến lược tổng thể cho chiến dịch Branding hoặc Bán hàng",
      "Xác định nền tảng, đối tượng mục tiêu, KPIs, ngân sách và phân bổ nguồn lực",
    ],
    inputs: ["Kết quả từ Research AI", "Brief mục tiêu từ Marketing Manager"],
    outputs: [
      "Tài liệu chiến lược đề xuất",
      "Kế hoạch phân bổ ngân sách",
      "Đề xuất KPI",
    ],
  },
  content_agent: {
    id: "content_agent",
    name: "Content AI Agent",
    description: "Sáng tạo nội dung truyền thông & chuẩn SEO",
    responsibilities: [
      "Viết nội dung truyền thông đa nền tảng: Facebook, TikTok, Zalo, Email, Website...",
      "Soạn caption, mô tả video, nội dung website, kịch bản video, email, thông điệp",
      "Viết nội dung chuẩn SEO cho website/blog",
    ],
    inputs: [
      "Chiến lược từ Strategy AI",
      "Brief từ Marketing Manager",
      "Từ khóa SEO",
    ],
    outputs: [
      "Bộ nội dung hoàn chỉnh",
      "Caption mạng xã hội",
      "Bài viết chuẩn SEO",
    ],
  },
  media_agent: {
    id: "media_agent",
    name: "Media AI Agent",
    description: "Thiết kế hình ảnh & video truyền thông",
    responsibilities: [
      "Tạo ảnh, video, banner, poster, animation... phục vụ truyền thông đa nền tạng",
      "Tạo visual cho quảng cáo, bài post, landing page, email, sản phẩm",
    ],
    inputs: ["Nội dung từ Content AI", "Chiến lược & nền tảng mục tiêu"],
    outputs: ["Bộ asset media", "Ảnh post", "Video quảng cáo", "Banner Ads"],
  },
  ad_agent: {
    id: "ad_agent",
    name: "Ads AI Agent",
    description: "Quản lý quảng cáo đa nền tảng",
    responsibilities: [
      "Thiết lập & triển khai chiến dịch quảng cáo trên Facebook, TikTok, Google…",
      "Theo dõi hiệu quả, A/B test, điều chỉnh khi cần",
      "Gửi cảnh báo khi vượt ngưỡng ngân sách hoặc ROAS kém",
    ],
    inputs: [
      "Nội dung từ Content AI",
      "Media từ Media AI",
      "Target, ngân sách, KPI",
    ],
    outputs: [
      "Trạng thái chiến dịch",
      "Báo cáo hiệu suất",
      "Cảnh báo ngân sách",
    ],
  },
  report_agent: {
    id: "report_agent",
    name: "Report AI Agent",
    description: "Phân tích hiệu quả & báo cáo chiến dịch",
    responsibilities: [
      "Thu thập, tổng hợp dữ liệu từ các chiến dịch Marketing",
      "Đánh giá hiệu suất: CPC, CPM, CTR, ROAS, số đơn, tỷ lệ chốt…",
      "Phân tích xu hướng & đề xuất cải tiến",
    ],
    inputs: ["Dữ liệu từ Ads AI, Chatbot AI, Order AI", "KPI mục tiêu"],
    outputs: [
      "Báo cáo chi tiết hiệu quả",
      "Dashboard thống kê",
      "Gợi ý cải tiến",
    ],
  },
};

export const toolNameMap = {
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

export const agentNameMap = {
  marketing_manager: "Marketing Manager",
  marketing_manager_tool: "Marketing Manager",
  research_agent: "Research Agent",
  strategy_agent: "Strategy Agent",
  media_agent: "Media Agent",
  content_agent: "Content Agent",
  ad_agent: "Ad Agent",
  report_agent: "Report Agent",
};

export const responseTemplates = {
  greeting: [
    "Dạ em nghe Sếp ơi. Sếp cần em hỗ trợ công việc gì tiếp theo ạ?",
    "Xin chào! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn hôm nay?",
    "Chào bạn! Các AI Agent đã sẵn sàng để hỗ trợ bạn với các nhiệm vụ marketing.",
  ],
  campaign_creation: {
    message:
      "🎯 **Tạo chiến dịch quảng cáo mới**\n\nDạ vâng Sếp. Để bắt đầu tạo chiến dịch quảng cáo, Sếp vui lòng cho em biết mục tiêu của chiến dịch lần này là gì ạ?\n\n1. Tăng tin nhắn (Messenger)\n2. Tăng lượt truy cập & mua hàng trên Landing Page (Chuyển đổi)\n3. Tăng lượt thích trang (Page Likes)",
    options: ["Messenger", "Chuyển đổi", "Page Likes"],
  },
  empty_activities:
    "📊 Hiện tại chưa có hoạt động nào được ghi nhận. Các AI Agent đang sẵn sàng để hỗ trợ bạn.",
};
