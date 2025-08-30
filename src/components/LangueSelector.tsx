import React, { useState, useEffect, useRef } from "react";

const imgLangue = "/icon-langue.png";

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

const languageOptions: LanguageOption[] = [
  {
    value: "vietnamese",
    label: "Tiếng Việt",
    flag: "/icon-vn.svg",
  },
  {
    value: "english",
    label: "English",
    flag: "/icon-great-eng.svg",
  },
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("vietnamese");
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = languageOptions.find(
    (option) => option.value === selectedLanguage
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
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

  const handleOptionSelect = (value: string) => {
    setSelectedLanguage(value);
    setIsOpen(false);
  };

  return (
    <div className="mb-4" ref={selectRef}>
      <div
        className="flex items-center gap-2 whitespace-nowrap cursor-pointer justify-between "
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-[5px]">
          <img className="w-5 h-5 flex-shrink-0" src={imgLangue} alt="" />
          <span className="text-sm flex-shrink-0">Ngôn ngữ</span>
        </div>
        <div className="relative flex-shrink-0   ">
          <div
            className="bg-[#3D3939] text-white text-xs pl-9 pr-8 py-2 w-29 cursor-pointer flex items-center border border-[#FFFFFF]/5 rounded-xl p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{selectedOption?.label}</span>
          </div>

          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={selectedOption?.flag}
              alt="Current Flag"
              className="w-5 h-5 rounded-full"
            />
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src="/icon-sort-down.svg"
              alt=""
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isOpen && (
            <div className="absolute bottom-9 left-0 right-0 mt-1 bg-[#3D3939] rounded-md shadow-lg border border-[#FFFFFF]/5 rounded-xl p-1 z-50">
              {languageOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-white cursor-pointer hover:bg-[#4A4545] transition-colors duration-150 rounded-[10px]"
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <img
                    src={option.flag}
                    alt={`${option.label} flag`}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                  />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
