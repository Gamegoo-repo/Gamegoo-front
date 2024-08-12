import styled from "styled-components";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "../match/SelectedStylePopup";
import Image from "next/image";
import { Dispatch, useEffect, useState } from "react";
import { GAME_STYLE } from "@/data/profile";

interface GameStyleProps {
    selectedIds: number[] | [];
    setSelectedStyleIds: Dispatch<React.SetStateAction<number[] | []>>;
}

const GameStyle = (props: GameStyleProps) => {
    const { selectedIds, setSelectedStyleIds } = props;

    const [styledPopup, setStyledPopup] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<number[] | []>(selectedIds);

    const handleStylePopup = () => {
        setStyledPopup(prevState => !prevState);
    };

    const handleClosePopup = () => {
        setStyledPopup(false);
    };

    const handleSelectStyle = (style: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setSelectedStyles((prevStyles: number[]) => {
            if (prevStyles.includes(style)) {
                return prevStyles.filter((s: number) => s !== style);
            } else if (prevStyles.length < 3) {
                return [...prevStyles, style];
            } else {
                return [...prevStyles.slice(1), style];
            }
        });
    };

    useEffect(() => {
        setSelectedStyleIds(selectedStyles);
    }, [selectedStyles, setSelectedStyleIds]);

    return (
        <>
            <StylesWrapper>
                {selectedStyles.map((styleId) => {
                    const style = GAME_STYLE.find(item => item.id === styleId);
                    return (
                        <Content key={styleId}>
                            {style?.text}
                        </Content>
                    );
                })}
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
                        position="board"
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
    grid-template-columns: repeat(3, minmax(100px, auto));
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
  justify-content: center;
  align-items: center;
  width: 39px;
  height: 30px;
  padding: 8px 12px;
  margin-top: 15px;
  border-radius: 17px;
  background: ${theme.colors.purple300};
  cursor: pointer;
`;