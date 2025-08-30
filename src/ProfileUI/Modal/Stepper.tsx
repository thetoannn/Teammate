import React, { useState, Children, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepperProps {
  children: React.ReactNode;
  initialStep?: number;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string | ((currentStep: number) => string);
  nextButtonText?: string | ((currentStep: number) => string);
  disableStepIndicators?: boolean;
  hideFooterOnStep?: number;
  renderStepIndicator?: (props: {
    step: number;
    currentStep: number;
    onStepClick: (step: number) => void;
  }) => React.ReactNode;
}

export default function Stepper({
  children,
  initialStep = 1,
  currentStep: controlledCurrentStep,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Quay lại",
  nextButtonText = "Tiếp tục",
  disableStepIndicators = true,
  hideFooterOnStep,
  renderStepIndicator,
  ...rest
}: StepperProps) {
  const [internalCurrentStep, setInternalCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;

  // Use controlled step if provided, otherwise use internal state
  const currentStep =
    controlledCurrentStep !== undefined
      ? controlledCurrentStep
      : internalCurrentStep;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  // Sync internal state with controlled prop and update direction
  React.useEffect(() => {
    if (controlledCurrentStep !== undefined) {
      if (controlledCurrentStep !== internalCurrentStep) {
        setDirection(controlledCurrentStep > internalCurrentStep ? 1 : -1);
        setInternalCurrentStep(controlledCurrentStep);
      }
    }
  }, [controlledCurrentStep, internalCurrentStep]);

  const updateStep = (newStep: number) => {
    if (controlledCurrentStep === undefined) {
      setInternalCurrentStep(newStep);
    }
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div className="w-full" {...rest}>
      <div className={`${stepCircleContainerClassName}`}>
        <div
          className={`${stepContainerClassName} flex w-full items-center justify-center mb-2`}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked: number) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked: number) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
        {!isCompleted && hideFooterOnStep !== currentStep && (
          <div className={`${footerClassName}`}>
            <div className="flex justify-end space-x-3 mt-5">
              {!(backButtonProps.style?.display === 'none') && (
                <button
                  onClick={
                    currentStep === 1
                      ? backButtonProps.onClick || (() => {})
                      : backButtonProps.onClick || handleBack
                  }
                  className={backButtonProps.className || "px-5 py-1 rounded-[9px] text-white/70 hover:text-white transition-colors cursor-pointer"}
                  {...backButtonProps}
                >
                  {typeof backButtonText === "function"
                    ? backButtonText(currentStep)
                    : backButtonText}
                </button>
              )}
              <button
                onClick={
                  isLastStep ? handleComplete : handleNext
                }
                className={`${currentStep === 2 ? 'px-2' : 'px-5'} py-1 rounded-[9px] bg-[#FFFFFF]/20 hover:bg-[#7B8290] text-white transition-colors cursor-pointer`}
                {...nextButtonProps}
       
              >
                {isLastStep 
                  ? "Hoàn thành" 
                  : typeof nextButtonText === "function"
                    ? nextButtonText(currentStep)
                    : nextButtonText}

              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: React.ReactNode;
  className: string;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}: StepContentWrapperProps) {
  return (
    <motion.div
      style={{
        position: "relative",
        overflow: "hidden",
        height: isCompleted ? 0 : "400px",
      }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            currentStep={currentStep}
            onHeightReady={() => {}} // No longer needed since we use fixed height
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: number;
  currentStep: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({
  children,
  direction,
  currentStep,
  onHeightReady,
}: SlideTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "400px",
        overflowY: currentStep === 2 ? "hidden" : "auto",
      }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

interface StepProps {
  children: React.ReactNode;
}

export function Step({ children }: StepProps) {
  return <div>{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete"; 
  const stepLabels = ["Chọn gói Credits", "Thanh toán", "Chờ xác nhận"];

  const handleClick = () => {
    // Prevent manual navigation to step 3 (confirmation step)
    // Step 3 should only be accessible when payment is successful
    if (step === 3) return;

    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        onClick={disableStepIndicators ? undefined : handleClick}
        className={`relative outline-none focus:outline-none mb-1 ${
          disableStepIndicators ? "pointer-events-none" : "cursor-pointer"
        }`}
        animate={status}
        initial={false}
      >
        <motion.div
          variants={{
            inactive: {
              scale: 0.9,
              backgroundColor: "#FFFFFF",
              color: "#3D3939",
            },
            active: {
              scale: 0.9,
              backgroundColor: "#4374FF",
              color: "#3D3939",
            },
            complete: {
              scale: 0.9,
              backgroundColor: "#4374FF",
              color: "#3D3939",
            },
          }}
          transition={{ duration: 0.3 }}
          className="flex h-10 w-10 items-center justify-center rounded-full font-semibold"
        >
          {status === "complete" ? (
            <CheckIcon className="h-4 w-4 text-white" />
          ) : (
            <span className="text-sm">{step}</span>
          )}
        </motion.div>
      </motion.div>
      <span
        className={`text-sm whitespace-nowrap ${
          status === "active" ? "text-white font-medium" : "text-white"
        }`}
      >
        {stepLabels[step - 1]}
      </span>
    </div>
  );
}

interface StepConnectorProps {
  isComplete: boolean;
}

function StepConnector({ isComplete }: StepConnectorProps) {
  return (
    <div className="w-20 h-[1.3px] mx-4 mt-[-24px] relative overflow-hidden rounded">
      <div className="absolute inset-0 bg-white/20" />
      <motion.div
        className="absolute left-0 top-0 h-full bg-[#4374FF]"
        initial={{ width: 0 }}
        animate={{ width: isComplete ? "100%" : 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
