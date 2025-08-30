import React, { FC, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import NotLoginForm from "../components/NotLoginForm";
import AgentList from "../components/AgentList";
import DataDirect from "../ProductListUI/DataProduct/DataDirect";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useCurrentPlanName } from "../hooks/useCurrentPlan";
import PlanName from "../ProfileUI/PlanName";

const homeIconSide = "/icon-home-side.png";
const brandLogoMain = "/brand-logo-main.png";
const contactIconSide = "/icon-contact-side.png";
const aboutIconSide = "/icon-about-side.png";
const agenticIconSide = "/icon-agentic.png";

const setupIconSide = "/icon-pr-setup.svg";
const SideBarChat: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isAuthenticated, user } = useAuth();
  const { avatarUrl } = useAvatarUrl(user?.picture);
  const { planName } = useCurrentPlanName();
  const { pathname, search } = useLocation();
  const sp = new URLSearchParams(search);

  const forcedAgent =
    sp.get("agent") || (pathname === "/media-agent" ? "media-agent" : undefined);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-[66px] p-[13px] flex flex-col z-20 hidden sidebar-visible"
        style={{ backgroundColor: "#1D1D1D" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-[27px]">
              <Link
                to="/"
                className="flex items-center justify-center leading-[27px] mb-1 relative group"
              >
                <div className="icon text-[29px] block text-white flex justify-center items-center">
                  <img
                    className=" duration-300 ease-in-out group-hover:scale-[1.2] "
                    src={brandLogoMain}
                    alt="logo-company"
                  />
                </div>
              </Link>
            </div>

            <div className="">
              <div className="mb-[20px] mt-[35px]">
                <Link
                  to="/"
                  className="flex items-center py-0 justify-center leading-[27px] mb-1 relative box-border w-[41px] h-[41px] rounded-[10px] group bg-[#313131] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer "
                >
                  <div className=" block text-white flex justify-center items-center pt-1 pb-[5px]">
                    <img
                      className="w-[23px] h-[23px] pb-px transform transition-transform duration-300 ease-in-out group-hover:scale-[1]"
                      src={homeIconSide}
                      alt="iconHome"
                    />
                  </div>
                </Link>
                <div className="text-white flex items-center justify-center h-full whitespace-nowrap text-[10px]">
                  Trang chủ
                </div>
              </div>

              <div className="mb-[20px]">
                <button
                  type="button"
                  className="flex items-center justify-center leading-[27px] mb-1 relative hover:bg-[#313131] box-border rounded-[9px] group hover:scale-105 transition-transform duration-300 ease-in-out  cursor-pointer"
                >
                  <div className="icon block text-white flex justify-center items-center  w-[41px] h-[41px]">
                    <img
                      className="line group-hover:scale-[1.2]  transition-all duration-300 ease-in-out dark:text-white w-[22px] h-[22px]"
                      src={aboutIconSide}
                      alt="iconAbout"
                    />
                  </div>
                </button>
                <div className="text-white flex items-center justify-center h-full whitespace-nowrap text-[9px]">
                  Về chúng tôi
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex items-center py-0 justify-center leading-[27px] mb-1 relative box-border rounded-[10px] group hover:bg-[#313131] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                >
                  <div className="icon block text-white flex justify-center items-center p-1 w-[41px] h-[41px]">
                    <img
                      src={contactIconSide}
                      alt="logo-company"
                      className="transform transition-transform duration-300 ease-in-out group-hover:scale-[1.2] w-[21px] h-[21px]"
                    />
                  </div>
                </button>
                <div className="text-white flex items-center justify-center h-full whitespace-nowrap text-[10px]">
                  Liên hệ
                </div>
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-700">
              <hr className="h-px my-5 bg-[#656262] border-0 w-[calc(100%+15px)] -mx-[8px]" />
            </div>

            <div className="mb-[18px]">
              <AgentList forcedAgent={forcedAgent} />
            </div>
          </div>

          <div className="mt-auto">
            <button
              ref={buttonRef}
              onClick={toggleForm}
              className={`${
                isAuthenticated && user ? "ml-0" : "ml-1"
              } flex items-center justify-center leading-[27px] w-[30px] h-[30px] mb-1 relative box-border rounded-full group hover:scale-105 transition-transform duration-300 ease-in-out px-1 cursor-pointer ${
                isAuthenticated && user ? "" : "bg-[#DB2777] w-[30px] h-[30px]"
              }`}
            >
              <div className="icon text-[16px] block text-white ml-2">
                {isAuthenticated && user ? (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="User Profile"
                      className=" items-center justify-center w-[30px] h-[30px] max-w-[30px] rounded-full object-cover group-hover:scale-[1.2] transition-all duration-300 ease-in-out"
                    />
                  ) : (
                    <div className="py-1 px-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold group-hover:scale-[1.2] transition-all duration-300 ease-in-out ">
                      {user.name
                        ? user.name.charAt(0).toUpperCase()
                        : user.email
                          ? user.email.charAt(0).toUpperCase()
                          : "U"}
                    </div>
                  )
                ) : (
                  <i className="ri-user-3-line group-hover:scale-[1.2] transition-all duration-300 ease-in-out dark:text-white"></i>
                )}
              </div>
            </button>
            <div
              className={`text-white flex items-center justify-center ml-[4px] whitespace-nowrap text-[9px] ${
                planName === "Free" || planName === "Plus" ? "mr-[8px]" : ""
              }`}
            >
              {isAuthenticated && user && <PlanName />}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div ref={formRef}>
          <NotLoginForm />
        </div>
      )}
    </>
  );
};

export default SideBarChat;
