import React from "react";
import { AgentActivity } from "../AgentChatTypes";
import { ObjectDisplayEnhanced } from "../utils/ObjectDisplayEnhanced";

interface ActivityDisplayFinalProps {
  activities: AgentActivity[];
  className?: string;
}

export const ActivityDisplayFinal: React.FC<ActivityDisplayFinalProps> = ({
  activities,
  className,
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className || ""}`}>
        <p>Không có hoạt động nào</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white p-4 rounded-lg shadow-sm border"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                {ObjectDisplayEnhanced.formatActivityTitle(activity)}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {ObjectDisplayEnhanced.formatActivityDescription(activity)}
              </p>
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>From: {activity.assigner || "Unknown"}</span>
                <span>To: {activity.assignee || "Unknown"}</span>
                {activity.createdTime && (
                  <span>{new Date(activity.createdTime).toLocaleString()}</span>
                )}
              </div>
            </div>
            <div className="ml-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  activity.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : activity.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {activity.status || "active"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
