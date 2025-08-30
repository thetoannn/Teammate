import React, { useState, useEffect } from "react";
import { AgentChatService } from "./AgentChatService";

import { ObjectDisplayEnhanced } from "./utils/ObjectDisplayEnhanced";

interface Activity {
  assigner?: string;
  assignee?: string;
  description?: string;
  content?: string;
  createdTime?: string;
  timestamp?: string;
}

interface ActivityResponse {
  data: {
    items?: Activity[];
  };
}

interface Props {
  isAgentActive?: boolean;
}

const agentNameMap: Record<string, string> = {
  ad_agent: "Ad Agent",
  marketing_manager: "Marketing Manager",
  research_agent: "Research Agent",
  strategy_agent: "Strategy Agent",
  media_agent: "Media Agent",
  content_agent: "Content Agent",
  report_agent: "Report Agent",
};

const toolNameMap: Record<string, string> = {
  create_campaign: "Tạo chiến dịch",
  create_creative: "Tạo vật lý",
  create_ad: "Tạo quảng cáo",
  create_fb_adset: "Tạo tập quảng cáo",
  update_ad_status: "Cập nhật trạng thái",
  get_facebook_ads_list: "Lấy danh sách quảng cáo",
};

const ActivityChat: React.FC<Props> = ({ isAgentActive = false }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadActivities = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await AgentChatService.getInstance().getAgentActivities(
        1,
        30
      );

      if (Array.isArray(response)) {
        setActivities(response);
      } else {
        const activityResponse = response as ActivityResponse;
        if (activityResponse?.data?.items) {
          setActivities(activityResponse.data.items);
        } else {
          setActivities([]);
        }
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const formatTime = (dateString?: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getAgentInitial = (assigner?: string): string => {
    return assigner?.charAt(0)?.toUpperCase() || "A";
  };

  const getAgentName = (assigner?: string): string => {
    return agentNameMap[assigner || ""] || assigner || "System";
  };

  const getToolName = (assignee?: string): string => {
    return toolNameMap[assignee || ""] || assignee || "Unknown";
  };

  const getActivityDescription = (activity: Activity): string => {
    const description = activity.description || activity.content || "";
    return ObjectDisplayEnhanced.formatForDisplay(description);
  };

  const getActivityTime = (activity: Activity): string => {
    return formatTime(activity.createdTime || activity.timestamp);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Hoạt động Agent</h3>
        {isAgentActive && (
          <span className="text-sm text-green-600">Đang hoạt động</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">
                      {getAgentInitial(activity.assigner)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {getAgentName(activity.assigner)}
                      </span>
                      <span className="text-xs text-gray-500">→</span>
                      <span className="text-xs text-gray-600">
                        {getToolName(activity.assignee)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 whitespace-pre-wrap">
                      {getActivityDescription(activity)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {getActivityTime(activity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm">Không có hoạt động nào</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityChat;
