import React, { useState } from "react";
import SubscriptionModal from "./Modal/SubscriptionModal";
import UltimateSubscriptionModal from "./Modal/UltimateSubscriptionModal";
import Screen2Component from "./Screen2Component";
import { usePlans, getPlansByType } from "../hooks/usePlans";


const planFeatures = {
  free: [
    "Luôn miễn phí",
    "Nhận 1000 Credits miễn phí mỗi ngày.",
    "Dùng được 2 Agent cơ bản: Research & Media Creator",
    "Trải nghiệm thử TeamMATE nhưng giới hạn credits",
    "Phù hợp: người mới, muốn thử trước khi nâng cấp."
  ],
  plus: [
    "500,000 credits/tháng – gấp 17 lần Free",
    "Toàn quyền dùng Research & Media Creator, không bị giới hạn credits theo ngày",
    "Thêm khả năng Download tài liệu không giới hạn.",
    "Thay thế một nhân viên part-time Marketing với chi phí < 1$/ngày",
    "Best value ở giai đoạn đầu – giá Early Bird, sau này tăng lên",
    "Phù hợp: doanh nghiệp nhỏ muốn bắt đầu nghiêm túc với AI Marketing"
  ],
  ultimate: [
    "1,500,000 credits/tháng – gấp 2,5 lần Plus",
    "Dùng đủ Research & Media Creator cao cấp không hạn chế.",
    "Ưu tiên mở khóa Facebook Lead Agent khi ra mắt (miễn phí)",
    "Giữ chỗ ngay bây giờ để được nâng cấp tự động",
    "Phù hợp: doanh nghiệp muốn đi trước, có lợi thế khi Facebook Agent dự kiến mở vào 15/09."
  ]
};

const UpdatePackageMonth: React.FC = () => {
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isUltimateSubscriptionModalOpen, setIsUltimateSubscriptionModalOpen] =
    useState(false);
  
  // Fetch plans data from API
  const { data: plansData, isLoading, isError, error } = usePlans();
  
  // Get plans by type (Free, Plus, Ultimate)
  const { freePlan, plusPlan, ultimatePlan } = getPlansByType(plansData?.data);

  const handlePlusUpgradeClick = () => {
    setIsUltimateSubscriptionModalOpen(true);
  };

  const handleUltimateUpgradeClick = () => {
    setIsSubscriptionModalOpen(true);
  };

  const handleClosePlusModal = () => {
    setIsUltimateSubscriptionModalOpen(false);
  };

  const handleCloseUltimateModal = () => {
    setIsSubscriptionModalOpen(false);
  };
  
  // Format price to display in USD
  const formatPrice = (price: number) => {
    return price.toFixed(1);
  };

  // Format credits number with dots for thousands
  const formatCredits = (credits: number) => {
    return credits.toLocaleString('de-DE');
  };

  // Render features list
  const renderFeatures = (features: any[], planData: any) => {
    return features.map((feature, index) => {
      if (typeof feature === 'string') {
        const isLastItem = index === features.length - 1;
        const colonIndex = feature.indexOf(':');
        const hasColon = colonIndex !== -1 && isLastItem;
        
        return (
          <li key={index} className="flex items-start">
            <img
              src="/icon-tick.svg"
              alt="tick"
              className="w-3 h-3 mt-1 mr-2 flex-shrink-0"
            />
            <span className="flex-1">
              {hasColon ? (
                <>
                  <span>{feature.substring(0, colonIndex + 1)}</span>
                  <span className="text-[#FFFFFF]/50 italic">
                    {feature.substring(colonIndex + 1)}
                  </span>
                </>
              ) : (
                feature
              )}
            </span>
          </li>
        );
      } else if (feature.type === 'sublist') {
        return (
          <li key={index} className="mb-1">
            <div className="flex items-start">
              <img
                src="/icon-tick.svg"
                alt="tick"
                className="w-3 h-3 mt-1 mr-2 flex-shrink-0"
              />
              <div className="flex-1">
                <span>Thêm hệ thống Agentic mới nhất gồm:</span>
                <ul className="ml-4 list-disc text-sm font-normal text-[#FFFFFF]/50 mt-1">
                  {feature.items.map((item: string, subIndex: number) => (
                    <li key={subIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      }
      return null;
    });
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="h-full bg-black/20 text-white p-5 flex items-center justify-center !overflow-y-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 !overflow-y-auto border-white mx-auto mb-4"></div>
          <p>Đang tải thông tin gói...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-black/20 text-white p-5 !overflow-y-auto flex items-center justify-center ">
        <div className="text-center">
          <div className="bg-red-500/20 p-4 rounded-xl mb-4">
            <p>Đã xảy ra lỗi khi tải thông tin gói.</p>
            <p className="text-sm text-red-300">{(error as Error)?.message}</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-white/60 hover:text-white flex items-center transition-colors bg-[#FFFFFF]/5 rounded-xl p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20 mx-auto"
          >
            <img src="/icon-up-left.svg" alt="Back" className="mr-2" />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black/20 text-white p-5" 
      style={{ overflowY: 'auto', height: '100vh' }}
    >
      <button
        onClick={() => window.history.back()}
        className="mt-1 text-white/60 hover:text-white flex items-center transition-colors bg-[#FFFFFF]/5 rounded-xl p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20"
      >
        <img src="/icon-up-left.svg" alt="Back" />
      </button>
      <h1 className="text-3xl font-semibold text-center" style={{ marginBottom: '30px' }}>
        Nâng cấp gói của bạn
      </h1>
      <div className="flex justify-center space-x-8">
        {/* Free Package */}
        <div className=" rounded-xl border-[#FFFFFF]/10 border p-4 w-[290px] flex flex-col h-[580px]">
          <div className="mb-8">
            <h2 className="text-white font-semibold text-[28px] mb-2">{freePlan?.name || "Free"}</h2>
            <p className="text-white text-2xl font-semibold mb-1">
              ${freePlan ? formatPrice(freePlan.price) : "0.0"}<span className="text-sm font-light"> USD</span>
              <span className="text-xs font-normal text-gray-500">/Month</span>
            </p>
          </div>
          <button
            disabled
            className="w-full bg-[#FFFFFF]/15 text-[#FFFFFF]/50 text-xs py-2 rounded-xl cursor-not-allowed mb-6"
          >
            Gói hiện tại của bạn
          </button>
          <ul className="text-sm font-normal space-y-4 text-white/90 flex-1">
            {renderFeatures(planFeatures.free, freePlan)}
          </ul>
        </div>

        {/* PLUS Package */}
        <div className="rounded-xl p-4 w-[290px] flex flex-col border border-[#FFFFFF]/10 relative h-[580px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold text-[28px]">{plusPlan?.name || "PLUS"}</h2>
            <span className="bg-gradient-to-r from-[#284699] via-[#2563EB] to-[#4374FF] text-white/80 text-[12px] px-2 py-1 rounded-bl-[10px] rounded-tr-[10px] w-[75px] h-[33px] flex items-center justify-center">
              Best Seller
            </span>
          </div>
          <p className="text-white text-2xl font-semibold mb-1">
            ${plusPlan ? formatPrice(plusPlan.price) : "48.9"}<span className="text-sm font-light"> USD</span>
            <span className="text-xs font-normal text-gray-500">/Month</span>
          </p>
          <p className="text-white/70 text-xs mb-4">Thanh toán hàng tháng</p>
          <button
            onClick={handlePlusUpgradeClick}
            style={{
              background: "linear-gradient(to right, #2563EB 0%, #153885 100%)",
            }}
            className="w-full bg-[#4374FF] hover:bg-[#5A7FFF] text-white text-xs py-2 rounded-xl mb-6 cursor-pointer"
          >
            Nâng cấp lên {plusPlan?.name || "PLUS"} ngay
          </button>
          <ul className="text-sm font-normal space-y-4 text-white/90 flex-1">
            {renderFeatures(planFeatures.plus, plusPlan)}
          </ul>
        </div>

        {/* ULTIMATE Package */}
        <div className="rounded-xl p-4 w-[290px] flex flex-col border border-[#FFFFFF]/10 relative h-[580px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-semibold text-[28px]">
              {ultimatePlan?.name || "ULTIMATE"} <span className="text-[#4374FF] text-sm font-semibold">Lite</span>
            </h2>
            <span className="bg-gradient-to-r from-[#811B31] to-[#E73058] text-white/80 text-[12px] px-2 py-1 rounded-bl-[10px] rounded-tr-[10px] w-[75px] h-[33px] flex items-center justify-center">
              Best Value
            </span>
          </div>
          <p className="text-white text-2xl font-semibold mb-1">
            ${ultimatePlan ? formatPrice(ultimatePlan.price) : "24.9"}<span className="text-sm font-light"> USD</span>
            <span className="text-xs font-normal text-gray-500">/Month</span>
          </p>
          <p className="text-white/70 text-xs mb-4">Thanh toán hàng tháng</p>

          <button
            onClick={handleUltimateUpgradeClick}
            style={{
              background: "linear-gradient(to right, #2563EB 0%, #153885 100%)",
            }}
            className="w-full bg-[#4374FF] hover:bg-[#5A7FFF] text-white text-xs py-2 rounded-xl mb-6 cursor-pointer"
          >
            Nâng cấp lên {ultimatePlan?.name || "ULTIMATE"} ngay
          </button>
          <ul className="text-sm font-normal space-y-4 text-white/90 flex-1">
            {renderFeatures(planFeatures.ultimate, ultimatePlan)}
          </ul>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={handleCloseUltimateModal}
      />

      <UltimateSubscriptionModal
        isOpen={isUltimateSubscriptionModalOpen}
        onClose={handleClosePlusModal}
      />
      
      {/* Screen2Component Section */}
      <div className="mt-16 ">
        <Screen2Component />
      </div>
    </div>
  );
};

export default UpdatePackageMonth;
