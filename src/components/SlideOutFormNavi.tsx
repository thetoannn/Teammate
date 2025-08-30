import React, { FC, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThreeDotsDropdown from "./ThreeDotsDropdown";

interface SlideOutFormNaviProps {
  isOpen: boolean;
  onClose: () => void;
}
const chatSlideIcon = "/icon-bubble.png";
const SlideOutFormNavi: FC<SlideOutFormNaviProps> = ({ isOpen, onClose }) => {
  const [items, setItems] = useState([
    { id: "item-1", name: "Tạo ảnh sản phẩm" },
    { id: "item-2", name: "Tạo ảnh sản phẩm" },
    { id: "item-3", name: "Tạo ảnh sản phẩm" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const slideOutRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside for slide-out panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        slideOutRef.current &&
        !slideOutRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle click outside for modal
  useEffect(() => {
    const handleModalClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancel();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleModalClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleModalClickOutside);
    };
  }, [isModalOpen]);

  const handleRename = (itemId?: string) => {
    if (!itemId) return;
    const item = items.find((i) => i.id === itemId);
    if (item) {
      setCurrentEditId(itemId);
      setNewName(item.name);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (itemId?: string) => {
    if (!itemId) return;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handleSave = () => {
    if (!currentEditId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === currentEditId ? { ...item, name: newName } : item
      )
    );
    setIsModalOpen(false);
    setCurrentEditId(null);
    setNewName("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentEditId(null);
    setNewName("");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-20 z-40 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        />
      )}

      <div
        ref={slideOutRef}
        className={`fixed left-[60px] top-0 h-full w-[241px] bg-[#2B2828] text-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ display: isOpen ? "block" : "none" }}
      >
        <div className="p-3 h-full flex flex-col">
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#313131] transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <i className="ri-menu-2-fill"></i>
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    className="rounded-[12px] hover:bg-[#313131] space-x-3 p-2 transition-colors  flex flex-col items-start cursor-pointer"
                    to="/"
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-2  ">
                      <img className="w-4 h-4" src={chatSlideIcon} alt="" />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center justify-between w-full text-gray-400 ">
                      <span className="text-[10px] text-gray-400">
                        Thứ 2, ngày 21 tháng 7 năm 2025
                      </span>
                      <ThreeDotsDropdown
                        onRename={() => handleRename(item.id)}
                        onDelete={() => handleDelete(item.id)}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSave();
            }
          }}
          tabIndex={-1}
        >
          <div
            ref={modalRef}
            className="bg-[#3D3939] rounded-xl p-6 w-80 max-w-full"
          >
            <h2 className="text-white text-center text-lg font-semibold mb-4">
              Đổi tên
            </h2>
            <input
              type="text"
              className="w-full p-2 rounded-[12px] mb-4 bg-[#474343] text-white border border-gray-600 focus:outline-none"
              placeholder="Tạo ảnh sản phẩm"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-1 rounded-[12px] bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
                onClick={handleCancel}
              >
                Hủy
              </button>
              <button
                className="px-6 py-1 rounded-[12px] bg-[#6C6969] hover:bg-[#7A7A73] text-white cursor-pointer"
                onClick={handleSave}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlideOutFormNavi;
