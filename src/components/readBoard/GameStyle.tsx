import styled from "styled-components";
import { theme } from "@/styles/theme";

interface StylesProps {
    id: number;
    text: string;
}

interface GameStyleProps {
    styles: StylesProps[]
}

const GameStyle = (props: GameStyleProps) => {
    const { styles } = props;
    return (
        <Div>
            {styles.map((data) => (
                <Content key={data.id}>
                    {data.text}
                </Content>
            ))}
        </Div>
    )
};

export default GameStyle;

const Div = styled.div`
    display: grid;
    grid-gap: 11px;
    grid-template-columns: repeat(auto-fit, minmax(100px, auto));
`;

const Content = styled.p`
  padding:6px 21px;  
  background: ${theme.colors.purple100};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.medium14};
  border-radius: 46px;
  white-space: nowrap;
  text-align: center;
`;