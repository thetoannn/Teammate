import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PickTool from "../../components/PickTool";

interface InputFeildProps {
  onSendMessage?: (message: string) => void;
}
const ideaIconSide = "/icon-idea.png";
const toolsIconSide = "/icon-tools.png";
const InputFeild: FC<InputFeildProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput !== "") {
      if (onSendMessage) {
        onSendMessage(trimmedInput);
      } else {
        navigate(
          `/chat?agent=marketing-assistant&message=${encodeURIComponent(
            trimmedInput
          )}`
        );
      }
      setInput("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[700px] mx-auto px-0 h-[102px]"
    >
      <div className="flex flex-col gap-2 sm:gap-[11px]">
        <div
          className="flex flex-col p-2 sm:p-[8px] border rounded-[25px] w-full min-h-[36px] sm:min-h-[50px] border-input-field-color"
          style={{ backgroundColor: "#313131", borderColor: "#656262" }}
        >
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Hỏi hoặc yêu cầu bất kỳ điều gì"
            className="w-full px-2 sm:px-[11px] py-1 sm:py-[5px] text-input-field focus:outline-none focus:ring-0 text-sm sm:text-[14px] bg-transparent"
          />
          <div className="flex items-center justify-between mt-2 sm:mt-[8px]">
            <div className="flex items-center gap-2 sm:gap-[11px] mt-2 sm:mt-[8px] ml-2 sm:ml-[8px]">
              <PickTool />
              <div className="relative group">
                <button
                  type="button"
                  className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <img
                    className="w-6 h-6 hover:text-gray-300 mt-1"
                    src={toolsIconSide}
                    alt="tools"
                  />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-100">
                  Cá nhân hóa
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-[11px] mt-2 sm:mt-[8px] mr-2 sm:mr-[8px] justify-end">
              <div className="relative group">
                <button
                  type="button"
                  className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <i className="ri-attachment-2 text-sm sm:text-[16px]"></i>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Chọn file
                </div>
              </div>
              <div className="relative group">
                <button
                  type="button"
                  className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  <i className="ri-mic-line text-sm sm:text-[16px]"></i>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Ghi âm
                </div>
              </div>
              <button
                type="submit"
                className={`flex text-white items-center justify-center leading-5 sm:leading-[27px] p-1 sm:p-[8px] py-1 sm:py-[5px] relative box-border rounded-[9px]  group ${
                  input.trim() === ""
                    ? "bg-[#FFFFFF0D] cursor-not-allowed"
                    : "bg-submit-input hover:scale-105 cursor-pointer"
                } transition-all duration-300 ease-in-out outline-none focus:ring-2 focus:ring-pink-400`}
                disabled={input.trim() === ""}
              >
                <i className="ri-send-plane-line text-sm sm:text-[16px] group-hover:scale-[1.2] transition-all duration-300 ease-in-out"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InputFeild;
