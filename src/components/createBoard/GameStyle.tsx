import styled from "styled-components";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "../match/SelectedStylePopup";
import Image from "next/image";
import { Dispatch, useEffect, useState } from "react";
import { GAME_STYLE } from "@/data/profile";
import { GameStyleList } from "@/interface/profile";

interface GameStyleProps {
    setSelectedIds: Dispatch<React.SetStateAction<number[]>>;
    selectedIds: number[];
    gameStyles: GameStyleList[];
}

const GameStyle = (props: GameStyleProps) => {
    const { setSelectedIds, selectedIds, gameStyles = [] } = props;

    const [styledPopup, setStyledPopup] = useState(false);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

    useEffect(() => {
        setSelectedIds(gameStyles.map(style => style.gameStyleId));
        setSelectedStyles(gameStyles.map(style => style.gameStyleName));
    }, [gameStyles]);

    const handleStylePopup = () => {
        setStyledPopup(prevState => !prevState);
    };

    const handleClosePopup = () => {
        setStyledPopup(false);
    };

    const handleSelectStyle = (id: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(selectedId => selectedId !== id);
            } else {
                if (prev.length === 3) {
                    return [...prev.slice(1), id];
                }
                return [...prev, id];
            }
        });
    };

    // const selectedStyles = selectedIds.map(id => GAME_STYLE.find(style => style.id === id)?.text);

    useEffect(() => {
        const updatedStyles = selectedIds.map(id => {
            const style = GAME_STYLE.find(style => style.id === id);
            return style ? style.text : '';
        }).filter(Boolean);
        setSelectedStyles(updatedStyles);
    }, [selectedIds]);

    return (
        <>
            <StylesWrapper>
                {selectedStyles?.map((style) => (
                    <Content key={style}>
                        {style}
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
                        selectedStyles={selectedIds}
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
  width: 39Px;
  height: 30px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  border-radius: 17px;
  background: ${theme.colors.purple300};
  cursor: pointer;
`;