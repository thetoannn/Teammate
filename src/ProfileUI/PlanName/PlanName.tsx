import React, { FC } from "react";
import { useCurrentPlanName } from "../../hooks/useCurrentPlan";

interface PlanNameProps {
  className?: string;
}

const PlanName: FC<PlanNameProps> = ({ className = "" }) => {
  const { planName, isLoading, error } = useCurrentPlanName();

  // Determine what to display based on the state
  const getDisplayName = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (planName) {
      console.log(
        "📋 PlanName: Displaying plan from current-plan endpoint (200 OK):",
        planName
      );
      return planName;
    }

    if (error) {
      console.log(
        "📋 PlanName: current-plan endpoint failed, using final fallback"
      );
      return "Ultra";
    }

    // Final fallback
    console.log("📋 PlanName: Using final fallback");
    return "Ultra";
  };

  const displayName = getDisplayName();

  return (
    <div
      className={`text-gray-300 font-[400]   whitespace-nowrap text-[12px] mt-1 mb-3  ${className}`}
    >
      {displayName}
    </div>
  );
};

export default PlanName;
