import React, {useRef} from "react";
import PDFDownloadButton from "../../components/PDFDownloadButton";
import { useCurrentPlanName } from "../../hooks/useCurrentPlan";

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceData?: {
        invoiceNumber: string;
        date: string;
        status: string;
        amount: string;
        details: string;
    };
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   invoiceData,
                                                               }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const { planName, isLoading: planLoading } = useCurrentPlanName();

    if (!isOpen) return null;

    const fileName = `Hoa-don-${
        invoiceData?.invoiceNumber || "INV-2025-0302"
    }.pdf`;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#3D3939] rounded-2xl p-8 max-w-[650px] w-full mx-4 relative">
                {/* Close button */}
                <div className="">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                        <svg width="15.85" height="15.85" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    {/* Modal Header */}
                    <h2 className="text-white mb-4 text-base">
                        Chi tiết hóa đơn
                    </h2>
                </div>
                <div className="-mx-8 border-t border-white/5 mb-5"></div>

                {/* Invoice Details */}
                <div ref={invoiceRef} className="space-y-6 ">
                    {/* Row 1: Invoice Number, Payment Date, Status */}
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-white/50 text-sm">Số hóa đơn</p>
                            <p className="text-white uppercase text-base">
                                {invoiceData?.invoiceNumber || "INV-2025-0302"}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">Ngày thanh toán</p>
                            <p className="text-white">
                                {invoiceData?.date || "02/03/2025"}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/50 text-sms">Trạng thái</p>
                            <p className="text-[#FFFFFF] text-base">
                                {invoiceData?.status === "SUCCESS"
                                    ? "Thành công"
                                    : invoiceData?.status === "PENDING_PAYMENT"
                                        ? "Chưa thanh toán"
                                        : "Thành công"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 ">
                        <div>
                            <p className="text-white/50 text-sm">Số tiền</p>
                            <p className="text-white">
                                {invoiceData?.amount + " VNĐ" || "6.000.000 VNĐ"}
                            </p>
                        </div>
                        <div>
                            <p className="text-white/50 text-sm">
                                Phương thức thanh toán
                            </p>
                            <p className="text-white">Chuyển khoản ngân hàng</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-white/50 text-sm mb-1">Thông tin khách hàng</p>
                        <p className="text-white">
                            Công ty TNHH Thương mại Điện tử ABC
                        </p>
                        <p className="text-white text-sm italic">
                            Mã số thuế: 0123456789
                        </p>
                        <p className="text-white text-sm italic">
                            Địa chỉ: 123 Đường Lê Lợi, Quận 1, TP.HCM
                        </p>
                    </div>

                    <div>
                        <div className="flex space-x-3">
                            <p className="text-white/50 text-sm mt-3 ">Chi tiết gói dịch vụ</p>
                            <span
                                className="text-[#4374FF] bg-[#FFFFFF0D] px-3  text-[13px] rounded-full mt-3   ">
                {planLoading ? "..." : planName || "Plus"}
              </span>
                        </div>
                        <div className=" rounded-lg ">
                            <div className="flex items-center gap-2 mb-1"></div>
                            <div className="space-y-2 text-sm italic">
                                <p className="text-white">Thời hạn sử dụng: 1 tháng</p>
                                <p className="text-white">
                                    Credits tặng hàng tháng: 4.500.000
                                </p>
                                <p className="text-white">
                                    Số lượng người dùng: Không giới hạn
                                </p>
                                <p className="text-white">Hỗ trợ kỹ thuật 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <PDFDownloadButton
                        contentRef={invoiceRef}
                        fileName={fileName}
                        buttonText="Tải xuống"
                        className="text-sm flex items-center gap-2 pl-[6px] w-[103.74px] h-[36px] hover:bg-[#FFFFFF0D] text-white rounded-[11px] transition-colors cursor-pointer"
                        iconSrc="/iocn-dpdf.svg"
                    />
                    <button
                        onClick={onClose}
                        className="px-6 py-1 bg-[#FFFFFF33] text-sm w-[103.74px] h-[36px] hover:bg-[#FFFFFF0D] text-white rounded-[11px] transition-colors cursor-pointer  "
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;
