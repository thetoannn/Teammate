import React, { useState, useRef, useEffect } from "react";
import { NotificationModal } from "./ModaNotifi";

const ChatNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [chatNotifications, setNotifications] = useState([
    { id: 1, read: false, createdAt: new Date(Date.now() - 5 * 60 * 1000) }, // 5 minutes ago
    { id: 2, read: false, createdAt: new Date(Date.now() - 30 * 60 * 1000) }, // 30 minutes ago
    {
      id: 3,
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    }, // 2 hours ago
    {
      id: 4,
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    }, // 4 hours ago
    {
      id: 5,
      read: false,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    }, // 8 hours ago
    {
      id: 6,
      read: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }, // 2 days ago
    {
      id: 7,
      read: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    }, // 5 days ago
  ]);
  const iconBell = "/icon-bell.png";
  const notificationRef = useRef<HTMLDivElement>(null);

  const toggleNotification = () => {
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    setNotifications(chatNotifications.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (itemId: number) => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const unreadCount = chatNotifications.filter((n) => !n.read).length;

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const getRelativeTime = (createdAt: Date) => {
    const now = currentTime;
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      return `${diffInDays} ngày trước`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group" ref={notificationRef}>
      <button
        onClick={toggleNotification}
        className="text-white text-sm w-[30.58px] h-[30.58px] bg-white/5 rounded-full transition-colors cursor-pointer hover:bg-white/20 relative flex items-center justify-center"
      >
        <i className="ri-notification-2-line"></i>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-[7px]">
            {unreadCount}
          </span>
        )}
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        Thông báo
      </div>

      <div
        className={`absolute right-0 mt-2 w-70 bg-[#2E2E2E] rounded-xl shadow-lg z-30 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div
          onClick={markAllAsRead}
          className="flex p-2  px-3 bg-white/5 justify-between cursor-pointer rounded-xs "
        >
          <span className="text-[16px] font-[500]">Thông báo</span>
          <button className="text-xs text-[#4374FF] hover:text-white font-base transition-colors cursor-pointer ">
            Đọc tất cả
          </button>
        </div>
        <div
          className="max-h-44 overflow-y-auto p-2 pr-1 overflow-x-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#6C6969 transparent",
          }}
        >
          {chatNotifications.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleNotificationClick(item.id)}
              className={`p-1 bg-white/5 hover:bg-white/8 transition-colors cursor-pointer rounded-[8px] mb-2 last:mb-0 ${
                item.read ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-center  w-63">
                <div className="flex-shrink-0 w-8 h-8 rounded-full  flex items-center justify-center">
                  <img src={iconBell} alt="" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-xs text-white/60 mt-1 mr-4">
                    {truncateText("Tài khoản của bạn sẽ hết hạn sau 2026", 34)}
                  </p>
                  <p className="text-xs text-gray-400 flex items-start">
                    {getRelativeTime(item.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <NotificationModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default ChatNotifications;
