import React, { useState, useEffect, useRef, FC } from "react";
import { Link } from "react-router-dom";
import "../../styles/custom.css";

const AiHashName: FC = () => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <>
      <Link to="#">
        <div>
          <span className="hover-glow text-[25px] font-[var(--my-font-weight)] px-[11px] text-center block">
            Marketing Assistant Agent
          </span>
        </div>
      </Link>
    </>
  );
};

export default AiHashName;
