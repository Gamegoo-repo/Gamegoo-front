import styled from "styled-components";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "../match/SelectedStylePopup";
import Image from "next/image";
import { useState } from "react";
import SelectedStyle from "./SelectedStyle";

interface StylesProps {
    id: number;
    text: string;
}

interface GameStyleProps {
    styles: StylesProps[]
}

const GameStyle = (props: GameStyleProps) => {
    const { styles } = props;

    const [styledPopup, setStyledPopup] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

    const handleStylePopup = () => {
        setStyledPopup(prevState => !prevState);
    };

    const handleClosePopup = () => {
        setStyledPopup(false);
    };

    const handleSelectStyle = (style: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setSelectedStyles((prevStyles) => {
            if (prevStyles.includes(style)) {
                return prevStyles.filter((s) => s! == style);
            } else if (prevStyles.length < 3) {
                return [...prevStyles, style];
            } else {
                return prevStyles;
            }
        });
    };
    return (
        <>
            <StylesWrapper>
                {styles.map((data) => (
                    <Content key={data.id}>
                        {data.text}
                    </Content>
                ))}
            </StylesWrapper>
            <Div>
                <AddGameStyle onClick={handleStylePopup}>
                    <Image
                        src="/assets/icons/plus.svg"
                        width={14}
                        height={14}
                        alt="추가"
                    />
                </AddGameStyle>
                {styledPopup && (
                    <SelectedStylePopup
                        onClose={handleClosePopup}
                        selectedStyles={selectedStyles}
                        onSelectStyle={handleSelectStyle}
                        position="top"
                    />
                )}
            </Div>
        </>
    )
};

export default GameStyle;

const StylesWrapper = styled.div`
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

const Div = styled.div`
  width: 62px;
  border-radius: 25px;
  position: relative;
`;

const AddGameStyle = styled.p`
  display: flex;
  width: 39Px;
  height: 30px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  border-radius: 17px;
  background: ${theme.colors.purple300};
`;