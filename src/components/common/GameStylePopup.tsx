import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { GAME_STYLE } from "@/constants/profile";
import { theme } from "@/styles/theme";

import Box from "./Box";

interface GameStylePopupProps {
  onClose: () => void;
}
const GameStylePopup: React.FC<GameStylePopupProps> = ({ onClose }) => {
  return (
    <Container>
      <Top>
        3개까지 선택 가능
        <button onClick={onClose}>
          <Icon
            backgroundUrl="/assets/icons/close.svg"
            width={10}
            height={10}
          />
        </button>
      </Top>
      <StyledBox>
        {GAME_STYLE.map((data) => (
          <Box key={data.gameStyleId} text={data.gameStyleName} shape="round" />
        ))}
      </StyledBox>
    </Container>
  );
};

export default GameStylePopup;

const Container = styled.div`
  width: 800px;
  padding: 28px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  box-shadow: 0px 4px 8.9px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7px);
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;
