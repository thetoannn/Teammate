import React from "react";
import { Link } from "react-router-dom";
const setupIconSide = "/icon-pr-setup.svg";
const DataDirect = () => {
  return (
    <>
      <div>
        <Link to="/data-direct">
          <button
            type="button"
            className="flex items-center py-0 justify-center leading-[27px] mb-1 relative box-border rounded-[11px] group hover:bg-[#313131] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            <div className="p-[7px] pt-[6px] pb-[6px] icon block text-white flex justify-center items-center">
              <img
                src={setupIconSide}
                alt="logo-company"
                className="w-6 h-6 transform transition-transform duration-300 ease-in-out group-hover:scale-[1.2]"
              />
            </div>
          </button>
          <div className="text-gray-300  flex items-center justify-center h-full whitespace-nowrap text-[10px]">
            Dữ liệu
          </div>
        </Link>
      </div>
    </>
  );
};

export default DataDirect;
