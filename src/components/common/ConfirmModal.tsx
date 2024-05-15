import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import smileIcon from "../../../public/assets/icons/smile.svg";
import sadIcon from "../../../public/assets/icons/sad.svg";
import clickedSadIcon from "../../../public/assets/icons/clicked_smile.svg";

interface ConfirmModalProps {
    type: 'yesOrNo' | 'confirm' | 'img';
    children?: string | React.ReactNode;
    width: string;
    onClose: () => void;
}
const ConfirmModal = (props: ConfirmModalProps) => {
    const { type, children, width, onClose } = props;
    const [mannerStatus, setMannerStatus] = useState(false);
    const [badMannerStatus, setBadMannerStatus] = useState(false);

    const handleMannerEvaluate = () => {
        setMannerStatus((prevState) => !prevState);
        setBadMannerStatus(false);
    };

    const handleBadMannerEvaluate = () => {
        setBadMannerStatus((prevState) => !prevState);
        setMannerStatus(false);
    };

    return (
        <Wrapper $width={width}>
            <Main>
                {type === 'img' ?
                    <ImageTop>
                        <CloseButton>
                            <Image
                                onClick={onClose}
                                src="/assets/icons/close.svg"
                                width={10}
                                height={10}
                                alt="close button" />
                        </CloseButton>
                        <ImageWrapper>
                            <ClickArea onClick={handleMannerEvaluate}>
                                <Image
                                    src={mannerStatus ? clickedSadIcon : smileIcon}
                                    width={33}
                                    height={33}
                                    alt="smile icon" />
                                <MannerText>매너 평가하기</MannerText>
                            </ClickArea>
                            <ClickArea onClick={handleBadMannerEvaluate}>
                                <Image
                                    src={badMannerStatus ? clickedSadIcon : sadIcon}
                                    width={33}
                                    height={33}
                                    alt="smile icon" />
                                <MannerText>비매너 평가하기</MannerText>
                            </ClickArea>
                        </ImageWrapper>
                    </ImageTop>
                    :
                    <TextTop>
                        {children}
                    </TextTop>}
            </Main>
            <Footer>
                <Buttons>
                    <Button
                        className={type === 'img' ? undefined : 'noButton'}
                        disabled={type === 'img' && !mannerStatus && !badMannerStatus}
                        $type={type}>
                        {type === 'yesOrNo' ? '예' : '확인'}
                    </Button>
                    {type === 'yesOrNo' &&
                        <Button className='noButton' $type={type}>아니요
                        </Button>}
                </Buttons>
            </Footer>
        </Wrapper>
    )
};

export default ConfirmModal;

const Wrapper = styled.div<{ $width: string }>`
    width:${(props) => props.$width};
    background: ${theme.colors.white};
    border-radius: 11px;
    box-shadow: 0px 0px 14.76px 0px rgba(0, 0, 0, 0.15);
`

const Main = styled.main`
    padding: 0 4px;
`

const ImageTop = styled.div`
    border-bottom: 0.58px solid rgba(197,197, 199, 1);
`

const TextTop = styled.div`
    min-height: 189px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-bottom: 0.58px solid rgba(197,197, 199, 1);  
`

const CloseButton = styled.p`
    display:flex;
    padding:13px 15px 0;
    margin-bottom: 5px;
    img{
        margin-left:auto;
        cursor: pointer;
    }
`

const ImageWrapper = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 15px;
`

const ClickArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const MannerText = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:#2D2D2D;
    margin-top: 11px;
`

const Footer = styled.footer`
`

const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Button = styled.button<{ $type: string }>`
    text-align: center;
    ${({ $type }) =>
        $type === 'img'
            ? `${theme.fonts.bold11}`
            : `${theme.fonts.semiBold18}`};
    cursor: pointer;
    color:${({ $type }) =>
        $type === 'img'
            ? '#2D2D2D'
            : '#44515C'};
    width:100%;
    padding:15px 0;
   &:disabled{
    color:${theme.colors.gray300};
   }

    &.noButton{    
        border-radius:0 0 11px 0;
        &:hover,
        &:active,
        &:focus {
        color:${theme.colors.purple100};
        background:${theme.colors.gray500};
        }
    }
`