import Image from "next/image";

import styled from "styled-components";

interface MoreBoxButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

const MoreBoxButton = (props: MoreBoxButtonProps) => {
  const { onClick } = props;

  return (
    <Wrapper>
      <ThreeDotsImage
        onClick={onClick}
        src="/assets/icons/three_dots_button.svg"
        width={16}
        height={16}
        alt="더보기 버튼"
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

const ThreeDotsImage = styled(Image)`
  cursor: pointer;
`;
