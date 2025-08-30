import React, { FC, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ScreenHomePageOne from "./HomePage/PageOne/ScreenHomePageOne";
import ScreenHomePageTwo from "./HomePage/PageTwo/ScreenHomePageTwo";
import ChatField from "./ChatUI/ChatField";
import ScreenChatUI from "./ChatUI/ScreenChatUI";
import ScreenDataDirect from "./ProductListUI/ScreenDataDirect";

import "./styles/customHomeScreenTwo.css";
import ProfileAccountPage from "./ProfileUI/ProfileAccountPage";

import ProfileAccountHistoryPage from "./ProfileUI/ProfileAccountHistoryPage";
import UpdatePackageMonth from "./ProfileUI/UpdatePackageMonth";
import NotYetLogModal from "./HomePage/NotYetLogModal";
import googleAuthService from "./services/GoogleAuthService";
import { FinalHistoryPage } from "./ProfileUI/FinalHistoryPage";
import ProfileAccountPaymentPage from "./ProfileUI/ProfileAccountPaymentPage";

// Import new components from merged project
import AgentStudio from "./components/agent_studio/AgentStudio";
import Knowledge from "./components/knowledge/Knowledge";
import MaterialManager from "./components/material/MaterialManager";
import CanvasPage from "./components/canvas/CanvasPage";
import CanvasList from "./components/home/CanvasList";
import CommonSetting from "./components/settings/CommonSetting";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ThemeButton from "./components/theme/ThemeButton";
import TopMenu from "./components/TopMenu";
import Home from "@/components/home/Home";
import SettingsDialog from "./components/settings/dialog";
import { SocketProvider } from "./contexts/socket";
import { SocketStatus } from "./components/SocketStatus";
import AppLayout from "./layouts/AppLayout";

const App: FC = () => {
  const [showNotYetLogModal, setShowNotYetLogModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("token")) {
      console.log("🔍 App: OAuth callback detected with token parameter");
    }

    const authState = googleAuthService.getState();
    setIsAuthenticated(authState.isAuthenticated);
    setAuthLoading(authState.loading);

    if (
      !authState.isAuthenticated &&
      !authState.loading &&
      location.pathname === "/"
    ) {
      setShowNotYetLogModal(true);
    }

    const unsubscribe = googleAuthService.subscribe((state) => {
      setIsAuthenticated(state.isAuthenticated);
      setAuthLoading(state.loading);

      if (
        !state.isAuthenticated &&
        !state.loading &&
        location.pathname === "/"
      ) {
        setShowNotYetLogModal(true);
      } else if (state.isAuthenticated) {
        setShowNotYetLogModal(false);
      }
    });

    return unsubscribe;
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setShowNotYetLogModal(false);
    } else if (!isAuthenticated && !authLoading) {
      setShowNotYetLogModal(true);
    }
  }, [location.pathname, isAuthenticated, authLoading]);

  return (
    <ThemeProvider>
      <SocketProvider>
        {location.pathname === "/" && (
          <NotYetLogModal
            isOpen={showNotYetLogModal && !isAuthenticated && !authLoading}
            onClose={() => setShowNotYetLogModal(false)}
            feature="AI features"
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div
                className="homepage-scrollbar !pt-20 "
                style={{
                  height: "100vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <ScreenHomePageOne />

                <ScreenHomePageTwo />
              </div>
            }
          />
          <Route path="/chat" element={<ScreenChatUI />} />
          <Route path="/data-direct" element={<ScreenDataDirect />} />
          <Route path="/data-direct/products" element={<ScreenDataDirect />} />
          <Route path="/data-direct/media" element={<ScreenDataDirect />} />
          <Route path="/data-direct/documents" element={<ScreenDataDirect />} />
          <Route path="/data-direct/knowledge" element={<ScreenDataDirect />} />
          <Route path="/profile-account" element={<ProfileAccountPage />} />
          <Route
            path="/profile-account-payment"
            element={<ProfileAccountPaymentPage />}
          />
          <Route
            path="/profile-account-history"
            element={<ProfileAccountHistoryPage />}
          />
          <Route path="/final-history-page" element={<FinalHistoryPage />} />

          <Route
            path="/update-package-month"
            element={<UpdatePackageMonth />}
          />

          {/* New routes from merged project */}
          <Route path="/agent_studio" element={<AgentStudio />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route
            path="/assets"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <MaterialManager />
              </div>
            }
          />
          <Route path="/canvas/:id" element={<CanvasPage />} />

          {/* Chat routes */}
          <Route
            path="/chat-new"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <div className="flex-1 p-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Chat Interface</h1>
                    <p className="text-gray-600">
                      Chat component requires additional setup. Please use /chat
                      route for now.
                    </p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Home routes */}
          <Route
  path="/media-agent"
  element={
    <AppLayout>
      <Home />
    </AppLayout>
  }
/>

          {/* Settings routes */}
          <Route
            path="/settings"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <div className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Settings</h1>
                    <div className="grid gap-6">
                      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">
                          Provider Settings
                        </h2>
                        <p className="text-gray-600">
                          Configure your AI providers and models here.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <a
                          href="/settings/comfyui"
                          className="block p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <h3 className="font-medium">ComfyUI Settings</h3>
                          <p className="text-sm text-gray-600">
                            Configure ComfyUI integration
                          </p>
                        </a>
                        <a
                          href="/themes"
                          className="block p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <h3 className="font-medium">Theme Settings</h3>
                          <p className="text-sm text-gray-600">
                            Customize appearance and theme
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          <Route
            path="/settings/comfyui"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <div className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">
                      ComfyUI Settings
                    </h1>
                    <div className="text-center">
                      <p className="text-gray-600">
                        ComfyUI settings require configuration context. Please
                        access through main settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* ComfyUI routes */}
          <Route
            path="/comfyui"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <div className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">
                      ComfyUI Management
                    </h1>
                    <div className="text-center">
                      <p className="text-gray-600">
                        ComfyUI management interface. Install dialog requires
                        additional setup.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Auth routes - typically handled by dialogs, but adding for completeness */}
          <Route
            path="/auth/login"
            element={
              <div className="flex flex-col w-screen h-screen justify-center items-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Authentication</h1>
                  <p className="text-gray-600">
                    Login dialog requires authentication context. Please use
                    existing auth flow.
                  </p>
                </div>
              </div>
            }
          />

          {/* Theme routes */}
          <Route
            path="/themes"
            element={
              <div className="flex flex-col w-screen h-screen">
                <TopMenu />
                <div className="flex-1 p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Theme Settings</h1>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">Theme:</span>
                        <ThemeButton />
                      </div>
                      <p className="text-sm text-gray-600">
                        Choose between light, dark, or system theme preference.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Dialogs */}
        <SettingsDialog />

        {/* Socket Status Component */}
        <SocketStatus />
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
