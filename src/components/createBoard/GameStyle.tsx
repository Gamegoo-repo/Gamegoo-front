import styled from "styled-components";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "../match/SelectedStylePopup";
import Image from "next/image";
import { Dispatch, useState } from "react";
import { GAME_STYLE } from "@/data/profile";
import { GameStyleList } from "@/interface/profile";

interface GameStyleProps {
    type: "editing" | "posting";
    selectedIds: number[] | GameStyleList[] | undefined;
    setSelectedIds: Dispatch<React.SetStateAction<number[] | GameStyleList[] | undefined>>;
    gameStyles: number[] | GameStyleList[];
}

const GameStyle = (props: GameStyleProps) => {
    const { type, setSelectedIds, selectedIds, gameStyles = [] } = props;

    const [styledPopup, setStyledPopup] = useState(false);

    const selectedStyles: number[] = Array.isArray(selectedIds)
        ? selectedIds.map(id => (typeof id === 'number' ? id : id.gameStyleId))
        : [];

    const handleSelectStyle = (id: number) => {
        let updatedSelectedStyles = [...selectedStyles];

        if (updatedSelectedStyles.includes(id)) {
            updatedSelectedStyles = updatedSelectedStyles.filter(styleId => styleId !== id);
        } else {
            if (updatedSelectedStyles.length >= 3) {
                updatedSelectedStyles.shift();
            }
            updatedSelectedStyles.push(id);
        }

        if (type === "editing") {
            const updatedList = updatedSelectedStyles.map(styleId => {
                const foundStyle = (selectedIds as GameStyleList[]).find(style => style.gameStyleId === styleId);
                return foundStyle ? foundStyle : { gameStyleId: styleId, gameStyleName: '' };
            });
            setSelectedIds(updatedList);
        } else {
            setSelectedIds(updatedSelectedStyles);
        }
    };

    const handleStylePopup = () => {
        setStyledPopup(prevState => !prevState);
    };

    const handleClosePopup = () => {
        setStyledPopup(false);
    };

    return (
        <>
            <StylesWrapper>
                {selectedStyles.map((styleId) => {
                    const style = GAME_STYLE.find(s => s.id === styleId);
                    return (
                        <Content key={styleId} onClick={() => handleSelectStyle(styleId)}>
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
    );
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
  width: 39px;
  height: 30px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  border-radius: 17px;
  background: ${theme.colors.purple300};
  cursor: pointer;
`;