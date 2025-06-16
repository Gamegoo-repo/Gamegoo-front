import styled from "styled-components";
import { theme } from "@/styles/theme";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import { useEffect, useRef } from "react";
import { css } from "styled-components";

interface MoreBoxProps {
  items: MoreBoxMenuItems[];
  top: number;
  left?: number;
  right?: number;
  onClose?: (e: MouseEvent) => void;
}

const MoreBox = ({ items, top, left, right, onClose }: MoreBoxProps) => {
  const moreBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        onClose &&
        moreBoxRef.current &&
        !moreBoxRef.current.contains(event.target as Node)
      ) {
        onClose(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <MenuWrapper ref={moreBoxRef} $top={top} $left={left} $right={right}>
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick(e);
          }}
        >
          {item.text}
        </MenuItem>
      ))}
    </MenuWrapper>
  );
};

export default MoreBox;

const MenuWrapper = styled.div<{
  $top: number;
  $left?: number;
  $right?: number;
}>`
  width: 175px;
  position: absolute;
  top: ${(props) => props.$top}px;

  ${(props) => props.$left !== undefined && `left: ${props.$left}px;`}
  ${(props) => props.$right !== undefined && `right: ${props.$right}px;`}

  z-index: 100;
  box-shadow: 0 0 21.3px 0 #00000026;
  background: ${theme.colors.white};
  border-radius: 10px;

  @media (max-width: 700px) {
    ${(props) =>
      props.$left !== undefined &&
      css`
        left: ${props.$left - 215}px;
      `}
  }
`;

const MenuItem = styled.div`
  ${(props) => props.theme.fonts.medium15};
  color: #555555;
  white-space: nowrap;
  cursor: pointer;
  padding: 9px 20px 9px 20px;
  border-bottom: 1px solid ${theme.colors.gray400};
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 700px) {
    text-align: left;
  }
`;
