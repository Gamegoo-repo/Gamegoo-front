import { forwardRef } from "react";
import styled from "styled-components";

import Icon from "@/components/common/Icon";

interface MoreBoxButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const MoreBoxButton = forwardRef<HTMLButtonElement, MoreBoxButtonProps>(
  ({ onClick }, ref) => {
    return (
      <Wrapper>
        <Button ref={ref} onClick={onClick}>
          <Icon
            backgroundUrl="/assets/icons/three_dots_button.svg"
            width={16}
            height={16}
            style={{ cursor: "pointer" }}
          />
        </Button>
      </Wrapper>
    );
  }
);

MoreBoxButton.displayName = "MoreBoxButton";

export default MoreBoxButton;

const Wrapper = styled.div`
  width: 25px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button`
  all: unset;
  padding: 0;
  margin: 0;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
