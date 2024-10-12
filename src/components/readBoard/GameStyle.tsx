import styled from "styled-components";
import { theme } from "@/styles/theme";
import { GAME_STYLE } from "@/data/profile";
import { gameStyleResponseDTOList } from "@/interface/board";

interface GameStyleProps {
  styles: gameStyleResponseDTOList[];
}

const GameStyle = (props: GameStyleProps) => {
  const { styles } = props;

  const getTextById = (styleId: number) => {
    const gameStyle = GAME_STYLE.find((style) => style.gameStyleId === styleId);
    return gameStyle ? gameStyle.gameStyleName : "";
  };

  return (
    <Div>
      {styles &&
        styles.length > 0 &&
        styles.map((data, index) => (
          <Content key={index}>{getTextById(data.gameStyleId)}</Content>
        ))}
    </Div>
  );
};

export default GameStyle;

const Div = styled.div`
  display: grid;
  grid-gap: 11px;
  grid-template-columns: repeat(3, minmax(100px, auto));
`;

const Content = styled.p`
  padding: 6px 21px;
  background: ${theme.colors.purple100};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.medium14};
  border-radius: 46px;
  white-space: nowrap;
  text-align: center;
`;
