import { useRef, useState } from "react";

const useTooltipTransformOffset = () => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);

  const updateOffset = (triggerRect: DOMRect) => {
    const tooltipWidth = tooltipRef.current?.offsetWidth || 223;
    const viewportWidth = window.innerWidth;

    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const tooltipLeft = triggerCenterX - tooltipWidth / 2;

    let deltaX = 0;

    if (tooltipLeft < 8) {
      deltaX = 8 - tooltipLeft;
    } else if (tooltipLeft + tooltipWidth > viewportWidth - 8) {
      deltaX = viewportWidth - 8 - (tooltipLeft + tooltipWidth);
    }

    setOffsetX(deltaX);
  };

  return { tooltipRef, offsetX, updateOffset };
};

export default useTooltipTransformOffset;
