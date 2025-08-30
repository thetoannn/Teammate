import React from "react";

interface LoadingProps {
  type?: "spinner" | "skeleton" | "dots";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  type = "spinner",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (type === "spinner") {
    return (
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      />
    );
  }

  if (type === "skeleton") {
    return (
      <div className={`animate-pulse bg-gray-300 rounded ${className}`}>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className={`flex space-x-1 ${className}`}>
        <div
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{
            backgroundImage:
              "url(https://i.pinimg.com/1200x/ec/0d/68/ec0d68655a3fb2b4ad922ca0a57e7762.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{
            animationDelay: "0.1s",
            backgroundImage:
              "url(https://i.pinimg.com/1200x/ec/0d/68/ec0d68655a3fb2b4ad922ca0a57e7762.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div
          className={`${sizeClasses[size]} rounded-full animate-bounce`}
          style={{
            animationDelay: "0.2s",
            backgroundImage:
              "url(https://i.pinimg.com/1200x/ec/0d/68/ec0d68655a3fb2b4ad922ca0a57e7762.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
    );
  }

  return null;
};

export default Loading;
