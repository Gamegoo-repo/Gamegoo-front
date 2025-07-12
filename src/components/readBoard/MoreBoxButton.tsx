import styled from "styled-components";

import Icon from "@/components/common/Icon";

interface MoreBoxButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const MoreBoxButton = (props: MoreBoxButtonProps) => {
  const { onClick } = props;

  return (
    <Wrapper>
      <Icon
        onClick={onClick}
        backgroundUrl="/assets/icons/three_dots_button.svg"
        width={16}
        height={16}
        style={{
          cursor: "pointer",
        }}
      />
    </Wrapper>
  );
};

export default MoreBoxButton;

const Wrapper = styled.div`
  width: 25px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
