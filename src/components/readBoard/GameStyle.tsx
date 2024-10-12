import styled from "styled-components";
import { theme } from "@/styles/theme";
import { GAME_STYLE } from "@/data/profile";
import { gameStyleResponseDTOList } from "@/interface/board";

interface GameStyleProps {
  styles: number[]|gameStyleResponseDTOList[];
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
        styles.map((data, index) => {
          const styleId = typeof data === 'number' ? data : data.gameStyleId;
          return <Content key={index}>{getTextById(styleId)}</Content>;
        })}
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
