import React from 'react';

const Screen2Component: React.FC = () => {
  return (
    <div className=" text-white p-5">
      <div className="max-w-[950px] mx-auto">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-2">
          <img className="w-4 h-4" src="/icon-i.svg" alt="info icon" />
          <h2 className="text-[16px] font-medium text-[#4374FF] leading-none">Chi tiết</h2>
        </div>

        {/* Pricing Table */}
        <div className="border border-[#FFFFFF]/10 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr] bg-[#333333] text-[14px] font-bold text-white border-b border-white/10">
            <div className="p-4 border-white/10 flex items-center justify-start">AI Agent</div>
            <div className="p-4 border-white/10 flex items-center justify-start">Hạng mục</div>
            <div className="p-4 border-white/10 flex items-center justify-start">Nội dung</div>
            <div className="p-4 flex items-center justify-center">
              <div className="w-full text-center">
                <div className="mb-1">Gói khả dụng</div>
                <div className="flex justify-center space-x-4 text-[14px]">
                  <span className="text-[#4374FF] font-medium">Free</span>
                  <span className="text-[#4374FF] font-medium">Plus</span>
                  <span className="text-[#4374FF] font-medium">Ultimate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Research Agent - Row 1: Nhiệm vụ chính */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div className="p-4 pb-0 border-white/10 text-[14px] font-semibold text-white flex items-start justify-start row-span-3">
              Market Research Agent
            </div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Nhiệm vụ chính
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm leading-relaxed flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Phân tích thị trường & khách hàng để xây dựng chiến lược Marketing chính xác.
                </div>
              </div>
            </div>
            <div className="py-4 pl-2 flex items-center justify-start">
              <div className="flex space-x-6 text-sm">
                <div className="text-white/70 italic">
                  <div>Giới</div>
                  <div>hạn</div>
                </div>
                <span className="text-white italic">Có</span>
                <span className="text-white italic">Có</span>
              </div>
            </div>
          </div>

          {/* Market Research Agent - Row 2: Tính năng nổi bật */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Tính năng nổi bật
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-sm leading-relaxed flex items-start justify-start">
              <div className="w-full space-y-2">
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Phân tích khách hàng: </span>
                    <span className="text-white/50">Xây dựng hồ sơ theo Jobs-Pains-Gains</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Nghiên cứu thị trường: </span>
                    <span className="text-white/50">Quy mô, xu hướng, cơ hội phát triển</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Phân tích đối thủ: </span>
                    <span className="text-white/50">Thu thập thông tin, so sánh định vị</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Nghiên cứu từ khóa: </span>
                    <span className="text-white/50">SEO insights & keyword opportunities</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Theo dõi xu hướng: </span>
                    <span className="text-white/50">Trending topics & market signals</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Hành trình khách hàng: </span>
                    <span className="text-white/50">Mapping touchpoints & tối ưu cơ hội</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Phân tích SWOT: </span>
                    <span className="text-white/50">Điểm mạnh, yếu, cơ hội, thách thức</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Dự báo chiến lược: </span>
                    <span className="text-white/50">Forecasting & actionable recommendations</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Market Research Agent - Row 3: Lợi ích cho người dùng */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr] border-b border-white/10">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Lợi ích cho người dùng
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Phân tích thị trường & khách hàng để xây dựng chiến lược Marketing chính xác.
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Media Creator Agent - Row 1: Nhiệm vụ chính */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div className="p-4 border-white/10 text-[14px] font-semibold text-white flex items-start justify-start row-span-3">
              Media Creator Agent
            </div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Nhiệm vụ chính
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm leading-relaxed flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Tự động hóa thiết kế hình ảnh và video ngắn, giúp doanh nghiệp tạo nội dung truyền thông nhanh chóng và chuyên nghiệp.
                </div>
              </div>
            </div>
            <div className="py-4 pl-2 flex items-center justify-start">
              <div className="flex space-x-6 text-sm">
                <div className="text-white/70 italic">
                  <div>Giới</div>
                  <div>hạn</div>
                </div>
                <span className="text-white italic">Có</span>
                <span className="text-white italic">Có</span>
              </div>
            </div>
          </div>

          {/* Media Creator Agent - Row 2: Tính năng nổi bật */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Tính năng nổi bật
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-sm leading-relaxed flex items-start justify-start">
              <div className="w-full space-y-2">
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Tạo ảnh marketing: </span>
                    <span className="text-white/50">15+ loại ảnh phổ biến cho Social Marketing (CTA/Ưu đãi, Infographic, Feedback, Lookbook, Trích dẫn, Countdown, Review, Trước-Sau, Thông báo sự kiện, Quà tặng/ Lead Magnet, v.v.)</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Tạo video ngắn: </span>
                    <span className="text-white/50">Tự động dựng short video (Reels, TikTok) từ kịch bản hoặc nội dung có sẵn</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Tùy chỉnh thương hiệu: </span>
                    <span className="text-white/50">Tích hợp logo, màu sắc, font chữ theo brand guideline</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Tạo nhanh: </span>
                    <span className="text-white/50">Chỉ cần mô tả nội dung, AI dựng ngay hình ảnh/ video hoàn chỉnh</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Chuẩn đa nền tảng: </span>
                    <span className="text-white/50">Xuất file theo tỉ lệ chuẩn Facebook, TikTok, YouTube Shorts...</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Media Creator Agent - Row 3: Lợi ích cho người dùng */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr] border-b border-white/10">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Lợi ích cho người dùng
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Không cần thuê designer/video editor, vẫn có nội dung marketing bắt mắt, nhất quán thương hiệu, xuất bản nhanh và tiết kiệm chi phí.
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Facebook Lead Agent - Row 1: Nhiệm vụ chính */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div className="p-4 border-white/10 text-[14px] font-semibold text-white flex items-start justify-start row-span-3">
              Facebook Lead Agent
            </div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Nhiệm vụ chính
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm leading-relaxed flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Vận hành trọn bộ Marketing trên Facebook – từ chiến lược, sáng tạo nội dung, sản xuất media, chạy quảng cáo, chăm sóc khách hàng đến báo cáo hiệu quả.
                </div>
              </div>
            </div>
            <div className="py-4 pl-2 flex items-center justify-start">
              <div className="flex space-x-6 text-sm">
                <div className="text-white/70 italic">
                  <div>Giới</div>
                  <div>hạn</div>
                </div>
                <span className="text-white italic">Có</span>
                <span className="text-white italic">Có</span>
              </div>
            </div>
          </div>

          {/* Facebook Lead Agent - Row 2: Tính năng nổi bật */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Tính năng nổi bật
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-sm leading-relaxed flex items-start justify-start">
              <div className="w-full space-y-2">
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Strategy: </span>
                    <span className="text-white/50">Đề xuất chiến lược funnel, performance campaign & remarketing dựa trên dữ liệu thị trường</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Content: </span>
                    <span className="text-white/50">Viết bài post, kịch bản video, caption theo AIDA/PAS/ Storytelling + tự động lên lịch & đăng bài theo kế hoạch</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Media: </span>
                    <span className="text-white/50">Sinh ảnh & video chuẩn Facebook (Ads, Posts, Reels), đồng bộ thương hiệu</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Ads: </span>
                    <span className="text-white/50">Chạy và quản lý quảng cáo Facebook (tạo chiến dịch, target, A/B test, tối ưu chi phí, theo dõi realtime)</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Chatbot: </span>
                    <span className="text-white/50">Tự động trả lời comment/inbox, nuôi dưỡng lead, gọi ý upsell</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white font-medium mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white font-medium">Report: </span>
                    <span className="text-white/50">Phân tích số liệu, so sánh chiến dịch, phát hiện vấn đề & đề xuất tối ưu</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Facebook Lead Agent - Row 3: Lợi ích cho người dùng */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr] border-b border-white/10">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Lợi ích cho người dùng
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Thay thế một phòng Marketing Facebook hoàn chỉnh: lên kế hoạch → tạo nội dung → xuất bản → chạy Ads → chăm sóc khách → báo cáo. Giúp doanh nghiệp triển khai nhanh, tiết kiệm chi phí nhân sự và tối ưu ROI.
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Content Creator Agent - Row 1: Nhiệm vụ chính */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div className="p-4 border-white/10 text-[14px] font-semibold text-white flex items-start justify-start row-span-3">
              Content Creator Agent
            </div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Nhiệm vụ chính
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm leading-relaxed flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Tạo nội dung chất lượng cao cho blog, social media và email marketing với tone of voice nhất quán và tối ưu hóa SEO.
                </div>
              </div>
            </div>
            <div className="py-4 pl-2 flex items-center justify-start">
              <div className="flex space-x-6 text-sm">
                <div className="text-white/70 italic">
                  <div>Giới</div>
                  <div>hạn</div>
                </div>
                <span className="text-white italic">Có</span>
                <span className="text-white italic">Có</span>
              </div>
            </div>
          </div>

          {/* Content Creator Agent - Row 2: Tính năng nổi bật */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Tính năng nổi bật
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-sm leading-relaxed flex items-start justify-start">
              <div className="w-full space-y-1">
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Viết blog post: </span>
                    <span className="text-white/50">Tạo bài viết dài 500-2000 từ với cấu trúc chuẩn SEO và hook hấp dẫn</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Social media content: </span>
                    <span className="text-white/50">Viết caption cho Facebook, Instagram, LinkedIn với hashtag research</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Email marketing: </span>
                    <span className="text-white/50">Soạn email sequence, newsletter với tỷ lệ mở cao</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Script video: </span>
                    <span className="text-white/50">Viết kịch bản cho YouTube, TikTok, Reels với storytelling hiệu quả</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Product description: </span>
                    <span className="text-white/50">Tạo mô tả sản phẩm thu hút và thuyết phục</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Brand voice consistency: </span>
                    <span className="text-white/50">Đảm bảo tone of voice nhất quán trên mọi kênh</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Keyword optimization: </span>
                    <span className="text-white/50">Tích hợp keyword research và tối ưu hóa nội dung</span>
                  </div>
                </div>
                <div className="flex">
                  <span className="text-white mr-2">•</span>
                  <div className="flex-1">
                    <span className="text-white">Content calendar: </span>
                    <span className="text-white/50">Lập kế hoạch nội dung theo chủ đề và mùa vụ</span>
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </div>

          {/* Content Creator Agent - Row 3: Lợi ích cho người dùng */}
          <div className="grid grid-cols-[1fr_1fr_4fr_1.2fr]">
            <div></div>
            <div className="p-4 border-white/10 text-white/80 text-[14px] font-normal flex items-start justify-start">
              <div className="flex">
                <span className="text-white/80 mr-2">•</span>
                <div className="flex-1">
                  Lợi ích cho người dùng
                </div>
              </div>
            </div>
            <div className="p-4 border-white/10 text-white text-sm flex items-start justify-start">
              <div className="flex">
                <span className="text-white mr-2">•</span>
                <div className="flex-1">
                  Tiết kiệm thời gian viết content, có nội dung chất lượng cao với tone of voice nhất quán, tăng engagement và conversion rate mà không cần thuê content writer riêng.
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen2Component;
