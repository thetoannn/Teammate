import React, { useState } from "react";
import ProductToolIndicator from "./ProductToolIndicator";
import ExpandArrow from "./ExpandArrow";
import ProductListTable from "./ProductListTable";
import { ProductData } from "./utils/productDataFormatter";

interface ProductToolWrapperProps {
  aiResponse?: string;
  isVisible: boolean;
  isLoading?: boolean;
  productData?: ProductData[];
}

const ProductToolWrapper: React.FC<ProductToolWrapperProps> = ({
  aiResponse = "",
  isVisible,
  isLoading = false,
  productData,
}) => {
  const [showProductTable, setShowProductTable] = useState(false);

  const handleToggleTable = () => {
    setShowProductTable(!showProductTable);
  };

  return (
    <>
      {!showProductTable ? (
        <div className="flex items-center gap-2">
          <ProductToolIndicator
            aiResponse={aiResponse}
            isVisible={isVisible}
            isLoading={isLoading}
            productData={productData}
            onToggle={handleToggleTable}
            isExpanded={showProductTable}
          />
        </div>
      ) : (
        <div className="w-full">
          <ProductListTable
            aiResponse={aiResponse}
            isLoading={isLoading}
            userQuery={aiResponse}
            data={productData}
            onClose={handleToggleTable}
          />
        </div>
      )}
    </>
  );
};

export default ProductToolWrapper;
