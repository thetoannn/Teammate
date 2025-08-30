import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { AvatarUpload } from "../UploadAva";
import { useAvatarUrl } from "../../hooks/useAvatarUrl";
import { useQueryClient } from "@tanstack/react-query";
import googleAuthService from "../../services/GoogleAuthService";
import avatarService from "../../services/AvatarService";
import axios from "axios";

// Skeleton component for loading state
const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex gap-10">
        {/* Left Column Skeleton */}
        <div className="space-y-3 pl-3">
          {/* Name field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-16 mb-1"></div>
            <div className="w-80 h-8 bg-white/10 rounded-md"></div>
          </div>

          {/* Email field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-20 mb-1"></div>
            <div className="w-full h-8 bg-white/10 rounded-md"></div>
          </div>

          {/* Phone field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-24 mb-1"></div>
            <div className="w-full h-8 bg-white/10 rounded-md"></div>
          </div>

          {/* Address field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-12 mb-1"></div>
            <div className="w-full h-8 bg-white/10 rounded-md"></div>
          </div>

          {/* Company field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-28 mb-1"></div>
            <div className="w-full h-8 bg-white/10 rounded-md"></div>
          </div>

          {/* Tax code field skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-20 mb-1"></div>
            <div className="w-full h-8 bg-white/10 rounded-md"></div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-3 max-w-[200px] flex-col !pr-10">
          {/* Avatar Section Skeleton */}
          <div>
            <div className="h-3 bg-white/20 rounded w-12 mb-1"></div>
            <div className="flex flex-col space-y-1">
              <div className="relative border border-dashed p-6 rounded-xl border-[#FFFFFF]/10">
                <div className="w-32 h-32 rounded-full bg-white/10"></div>
                <div className="absolute bottom-1 right-2 w-6 h-6 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Description field skeleton */}
          <div className="!pr-10">
            <div className="h-3 bg-white/20 rounded w-24 mb-1"></div>
            <div className="max-w-[163px] h-[175px] bg-white/10 rounded-md"></div>
          </div>

          {/* Button skeleton */}
          <div className="flex justify-end">
            <div className="h-7 w-20 bg-white/10 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
}) => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    companyName: "",
    taxCode: "",
    description: "",
    avatar: "",
  });

  // Use the optimized avatar hook
  const { avatarUrl: currentAvatar } = useAvatarUrl(formData.avatar);

  // Load user profile when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setInitialLoading(true);
      fetchUserProfile();
    }
  }, [isOpen, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setApiError(null);

      const token = await googleAuthService.getAuthToken();
      if (!token) {
        setApiError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://api.nhansuso.vn/api/user-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.data || response.data;

      setFormData({
        name: data.name || "",
        email: user?.email || data.email || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        companyName: data.companyName || "",
        taxCode: data.taxCode || "",
        description: data.description || "",
        avatar: data.avatar || "",
      });

      // Avatar will be handled by useAvatarUrl hook automatically

      setLoading(false);
      setInitialLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setApiError("Failed to load user profile");
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "email") return; // Prevent email editing

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarUploadSuccess = async (fileUrl: string) => {
    try {
      // Update form data - useAvatarUrl hook will handle the display URL automatically
      setFormData((prev) => ({
        ...prev,
        avatar: fileUrl,
      }));

      setUploadStatus("Avatar uploaded! Click 'Chỉnh sửa' to save.");
      setUploadError(null);

      setTimeout(() => setUploadStatus(null), 5000);
    } catch (error) {
      console.error("Failed to process uploaded avatar:", error);
      setUploadError("Failed to process uploaded avatar");
    }
  };

  const handleAvatarUploadError = (error: string) => {
    setUploadError(error);
    setUploadStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const payload = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        companyName: formData.companyName,
        taxCode: formData.taxCode,
        description: formData.description,
        avatar: formData.avatar,
        email: formData.email,
      };

      const token = await googleAuthService.getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        "https://api.nhansuso.vn/api/user-profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update global user profile if avatar changed
      if (formData.avatar && currentAvatar) {
        await googleAuthService.updateUserProfile({
          picture: formData.avatar, // Use the raw avatar path, not the display URL
        });
      }

      // Refresh user profile from API to ensure global state is updated
      await googleAuthService.refreshUserProfile();

      // Invalidate avatar cache to force refresh across all components
      queryClient.invalidateQueries({ queryKey: ["avatar"] });

      setUploadStatus("Profile updated successfully!");
      setTimeout(() => setUploadStatus(null), 3000);

      setLoading(false);

      if (onProfileUpdated) {
        onProfileUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Profile update failed:", error);
      setApiError("Failed to update user profile");
      setLoading(false);
    }
  };

  const renderAvatar = () => {
    // If we have a current avatar (uploaded or saved), show it
    if (currentAvatar) {
      return (
        <img
          src={currentAvatar}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover"
        />
      );
    }

    // If not authenticated, show default icon
    if (!isAuthenticated || !user) {
      return (
        <img
          src="/icon-avatar-user-df.svg"
          alt="Default Avatar"
          className="w-32 h-32 rounded-full object-cover"
        />
      );
    }

    // Show email letter fallback
    const letter =
      formData.email?.charAt(0)?.toUpperCase() ||
      user?.email?.charAt(0)?.toUpperCase() ||
      formData.name?.charAt(0)?.toUpperCase() ||
      user?.name?.charAt(0)?.toUpperCase() ||
      "U";

    return (
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
        {letter}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#3D3939] rounded-2xl w-full max-w-[566px]">
        <div className="flex items-center justify-between px-2  pr-3 py-4 ">
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center">
            
            </div>
            <h2 className="text-xl font-medium text-white">Chỉnh sửa thông tin </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="border-b border-white/10 w-129 relative left-[23px]"></div>
        <form onSubmit={handleSubmit} className="p-3 ">
          {/* Error State */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md">
              <div className="text-red-400 text-sm">{apiError}</div>
            </div>
          )}

          {/* Show skeleton during initial loading */}
          {initialLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="flex gap-10">
            <div className="space-y-3 pl-3">
              <div>
                <label className="block text-white text-xs mb-1">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-80 bg-[#FFFFFF]/5 rounded-md px-2 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-xs mb-1">
                  Địa chỉ Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFFFFF]/10 rounded-md px-2 py-2 text-sm text-white/70 placeholder-white/50 focus:outline-none cursor-not-allowed"
                  required
                  readOnly
                  disabled
                />
              </div>

              <div>
                <label className="block text-white text-xs mb-1">
                  Số điện thoại <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFFFFF]/5 rounded-md px-2 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-white text-xs mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFFFFF]/5 rounded-md px-2 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white text-xs mb-1">
                  Tên doanh nghiệp
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFFFFF]/5 rounded-md px-2 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white text-xs mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleInputChange}
                  className="w-full bg-[#FFFFFF]/5 rounded-md px-2 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 max-w-[200px] flex-col !pr-10">
              {/* Avatar Section */}
              <div>
                <label className="block text-white text-xs mb-1">
                  Avatar <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col space-y-1">
                  <div className="relative border border-dashed p-6 rounded-xl border-[#FFFFFF]/10">
                    {renderAvatar()}

                    <AvatarUpload
                      onUploadSuccess={handleAvatarUploadSuccess}
                      onUploadError={handleAvatarUploadError}
                      className="absolute bottom-1 right-2"
                    >
                      <button
                        type="button"
                        className="rounded-full p-0.5 transition-colors cursor-pointer hover:scale-[1.05]"
                      >
                        <img src="/icon-cmr-av.svg" alt="Upload Avatar" />
                      </button>
                    </AvatarUpload>
                  </div>

                  {uploadStatus && (
                    <div className="text-green-400 text-xs text-center">
                      {uploadStatus}
                    </div>
                  )}

                  {uploadError && (
                    <div className="text-red-400 text-xs text-center">
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>

              <div className="!pr-10 ">
                <label className="block text-white text-xs mb-1 ">
                  Giới thiệu về bạn
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="max-w-[163px] h-[175px] max-h-[291px] bg-[#FFFFFF]/5 rounded-md px-2 py-1.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#DB2777] transition-colors resize-none"
                  placeholder="Tôi là..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#6B7280] cursor-pointer hover:bg-[#7B8290] disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm px-4 py-1.5 rounded-md transition-colors justify-end"
                >
                  {loading ? "Đang lưu..." : "Chỉnh sửa"}
                </button>
              </div>
            </div>
          </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
