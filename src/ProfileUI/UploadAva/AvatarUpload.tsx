import React, { useRef } from "react";
import { useAvatarUpload } from "./useAvatarUpload";
import { useAuth } from "../../hooks/useAuth";

interface AvatarUploadProps {
  onUploadSuccess?: (fileUrl: string) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className = "",
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, error, uploadAvatar, clearError } = useAvatarUpload();
  const { isAuthenticated } = useAuth();

  const handleFileSelect = () => {
    if (!isAuthenticated) {
      const errorMsg = "Please login to upload avatar";
      onUploadError?.(errorMsg);
      return;
    }

    clearError();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Please select an image file";
      onUploadError?.(errorMsg);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = "File size must be less than 5MB";
      onUploadError?.(errorMsg);
      return;
    }

    try {
      console.log("📤 Uploading avatar:", file.name);
      const result = await uploadAvatar(file);

      if (result.success && result.fileUrl) {
        console.log("✅ Avatar upload successful:", result.fileUrl);
        onUploadSuccess?.(result.fileUrl);

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        console.error("❌ Avatar upload failed:", result.error);
        onUploadError?.(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("❌ Avatar upload error:", error);
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      onUploadError?.(errorMsg);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={uploading || !isAuthenticated}
      />

      <div
        onClick={handleFileSelect}
        className={`${className} ${
          uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children || (
          <button
            type="button"
            disabled={uploading || !isAuthenticated}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Avatar"}
          </button>
        )}
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="text-blue-500 text-xs mt-1">Uploading avatar...</div>
      )}

      {error && <div className="text-red-400 text-xs mt-1">{error}</div>}
    </>
  );
};

export default AvatarUpload;
