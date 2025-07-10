import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosition } from "@/redux/slices/chatPositionSlice";

type Position = {
  top: string;
  left: string;
};

type AdjustPositionCallback = (position: Position) => Position;

type DragEvent = React.MouseEvent<HTMLDivElement>;

type UseDragHook = {
  handleDragStart: (e: DragEvent) => void;
};

const useDrag = (
  _initialPosition: Position,
  adjustPositionCallback: AdjustPositionCallback
): UseDragHook => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();

  // 드래그 시작
  const handleDragStart = (e: DragEvent) => {
    setIsDragging(true);
    const overlay = e.currentTarget.parentElement;
    if (overlay) {
      const rect = overlay.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // 드래그 이동
  const handleDrag = (e: MouseEvent) => {
    if (!isDragging) return;

    const left = `${e.clientX - offset.x}px`;
    const top = `${e.clientY - offset.y}px`;
    const adjustedPosition = adjustPositionCallback({ top, left });
    dispatch(setPosition(adjustedPosition));
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // 마우스 이동 이벤트 등록 및 해제
  useEffect(
    () => {
      if (isDragging) {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", handleDragEnd);
      } else {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      }
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragging]
  );

  return { handleDragStart };
};

export default useDrag;
