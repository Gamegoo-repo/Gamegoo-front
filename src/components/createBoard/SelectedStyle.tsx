import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { GAME_STYLE } from "@/data/profile";

interface SelectedStylePopupProps {
    onClose: () => void;
    selectedStyles: string[];
    onSelectStyle: (style: string) => void;
  }
const SelectedStyle: React.FC<SelectedStylePopupProps> = ({
    onClose,
    selectedStyles,
    onSelectStyle,
  }) => {
return(
    <Container>
    <Top>
      3개까지 선택가능
      <Image
        src="/assets/icons/close_white.svg"
        width={14}
        height={14}
        alt="close"
        onClick={onClose}
      />
    </Top>
    <Boxs>
      {GAME_STYLE.map((data) => (
        <Box
          key={data.id}
          onClick={() => onSelectStyle(data.text)}
          selected={selectedStyles.includes(data.text)}
        >
          {data.text}
        </Box>
      ))}
    </Boxs>
  </Container>
)
};

export default SelectedStyle;

const Container = styled.div`
  position: absolute;
  z-index: 10;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20};
`;

const Boxs = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  outline: none;
`;

const Box = styled.button<{ selected: boolean }>`
  display: flex;
  height: 40px;
  padding: 10px 25px;
  justify-content: center;
  align-items: center;
  border-radius: 59.263px;
  background: ${({ selected }) =>
    selected ? theme.colors.purple100 : theme.colors.gray200};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20};
`;