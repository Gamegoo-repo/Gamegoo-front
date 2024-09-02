import styled from "styled-components";
import Image from "next/image";

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
        width={3}
        height={15}
        alt="더보기 버튼"
      />
    </Wrapper>
  );
};

export default MoreBoxButton;

const Wrapper = styled.div`
  margin-left: 26px;
`;

const ThreeDotsImage = styled(Image)`
  width: 15px;
  cursor: pointer;
`;
