import React, { useState } from "react";
import AddInfoModal from "./AddInfoModal";
import IncreaseClickModal from "./IncreaseClickModal";
import ProductInputModal from "./ProductInputModal";
import TargetAudienceModal from "./TargetAudienceModal";
import RatioModal from "./RatioModal";

interface DualModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateTitle?: string;
}

const DualModalContainer: React.FC<DualModalContainerProps> = ({
  isOpen,
  onClose,
  selectedTemplateTitle,
}) => {
  const [selectedObjective, setSelectedObjective] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedTargetAudience, setSelectedTargetAudience] =
    useState<string>("");
  const [selectedRatio, setSelectedRatio] = useState<string>("");
  const [showIncreaseClickModal, setShowIncreaseClickModal] =
    useState<boolean>(true);
  const [showProductInputModal, setShowProductInputModal] =
    useState<boolean>(false);
  const [showTargetAudienceModal, setShowTargetAudienceModal] =
    useState<boolean>(false);
  const [showRatioModal, setShowRatioModal] = useState<boolean>(false);

  const handleObjectiveSelect = (objective: string) => {
    setSelectedObjective(objective);
    setShowIncreaseClickModal(false); // Hide the IncreaseClickModal after selection
  };

  const handleOpenIncreaseClickModal = () => {
    // Close any other modal and open IncreaseClickModal
    setShowProductInputModal(false);
    setShowTargetAudienceModal(false);
    setShowRatioModal(false);
    setShowIncreaseClickModal(true);
  };

  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
    setShowProductInputModal(false); // Hide the ProductInputModal after selection
  };

  const handleOpenProductInputModal = () => {
    // Close any other modal and open ProductInputModal
    setShowIncreaseClickModal(false);
    setShowTargetAudienceModal(false);
    setShowRatioModal(false);
    setShowProductInputModal(true);
  };

  const handleTargetAudienceSelect = (targetAudience: string) => {
    setSelectedTargetAudience(targetAudience);
    setShowTargetAudienceModal(false); // Hide the TargetAudienceModal after selection
  };

  const handleOpenTargetAudienceModal = () => {
    // Close any other modal and open TargetAudienceModal
    setShowIncreaseClickModal(false);
    setShowProductInputModal(false);
    setShowRatioModal(false);
    setShowTargetAudienceModal(true);
  };

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio);
    setShowRatioModal(false); // Hide the RatioModal after selection
  };

  const handleOpenRatioModal = () => {
    // Close any other modal and open RatioModal
    setShowIncreaseClickModal(false);
    setShowProductInputModal(false);
    setShowTargetAudienceModal(false);
    setShowRatioModal(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative flex items-start max-h-[90vh]">
        {/* Center Modal - Add Info - Fixed position */}
        <div className="flex justify-center ">
          <AddInfoModal
            isOpen={true}
            onClose={onClose}
            selectedTemplateTitle={selectedTemplateTitle}
            selectedObjective={selectedObjective}
            selectedProduct={selectedProduct}
            selectedTargetAudience={selectedTargetAudience}
            selectedRatio={selectedRatio}
            onOpenIncreaseClickModal={handleOpenIncreaseClickModal}
            onOpenProductInputModal={handleOpenProductInputModal}
            onOpenTargetAudienceModal={handleOpenTargetAudienceModal}
            onOpenRatioModal={handleOpenRatioModal}
          />
        </div>

        {/* Right Side Modal - Absolute positioned */}
        {showIncreaseClickModal && (
          <div className="absolute left-full ml-2 top-55">
            <IncreaseClickModal
              isOpen={true}
              onClose={() => setShowIncreaseClickModal(false)}
              onObjectiveSelect={handleObjectiveSelect}
            />
          </div>
        )}

        {/* Product Input Modal - Same position as IncreaseClickModal */}
        {showProductInputModal && (
          <div className="absolute left-full ml-2 top-55">
            <ProductInputModal
              isOpen={true}
              onClose={() => setShowProductInputModal(false)}
              onProductSelect={handleProductSelect}
              initialValue={selectedProduct}
            />
          </div>
        )}

        {/* Target Audience Modal - Same position as IncreaseClickModal */}
        {showTargetAudienceModal && (
          <div className="absolute left-full ml-2 top-55">
            <TargetAudienceModal
              isOpen={true}
              onClose={() => setShowTargetAudienceModal(false)}
              onTargetAudienceSelect={handleTargetAudienceSelect}
            />
          </div>
        )}

        {/* Ratio Modal - Same position as IncreaseClickModal */}
        {showRatioModal && (
          <div className="absolute left-full ml-2 top-55">
            <RatioModal
              isOpen={true}
              onClose={() => setShowRatioModal(false)}
              onRatioSelect={handleRatioSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DualModalContainer;
