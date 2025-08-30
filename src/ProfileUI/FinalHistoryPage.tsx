
import React from "react";
import Screen2Component from "./Screen2Component";
import UpdatePackageMonth from "./UpdatePackageMonth";

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('UpdatePackageMonth Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export const FinalHistoryPage = () => {
  return (
    <>
      <div className="min-h-screen bg-[#1A1A1A] overflow-auto">
        {/* Simple header for debugging */}
        <div className="p-5">
          <h1 className="text-white text-2xl mb-4">Final History Page</h1>
          <p className="text-white/60 mb-8">This page contains UpdatePackageMonth and Screen2Component</p>
        </div>
        
        {/* UpdatePackageMonth Section with Error Boundary */}
        <div className="mb-8">
          <div className="px-5">
            <h2 className="text-white text-lg mb-4">Update Package Section:</h2>
          </div>
          <ErrorBoundary 
            fallback={
              <div className="px-5 py-8 text-center">
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300">UpdatePackageMonth component failed to load</p>
                  <p className="text-red-400 text-sm mt-2">Check console for details</p>
                </div>
              </div>
            }
          >
            <UpdatePackageMonth />
          </ErrorBoundary>
        </div>
        
        {/* Screen2Component Section */}
        <div className="mt-8">
          <div className="px-5">
            <h2 className="text-white text-lg mb-4">Screen2 Component Section:</h2>
          </div>
          <Screen2Component />
        </div>
      </div>
    </>
  );
};
  