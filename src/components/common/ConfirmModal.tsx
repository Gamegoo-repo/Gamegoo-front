import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface ConfirmModalProps {
    type: 'yesOrNo' | 'confirm' | 'img';
    children?: string | React.ReactNode;
    width: string;
}
const ConfirmModal = (props: ConfirmModalProps) => {
    const { type, children, width } = props;

    return (
        <Wrapper $width={width}>
            <Main>
                {type === 'img' ?
                    <ImageTop>
                        <CloseButton>
                            <Image
                                src="/assets/icons/close.svg"
                                width={10}
                                height={10}
                                alt="close button" />
                        </CloseButton>
                        <ImageWrapper>
                            <ImageBox>
                                <Image
                                    src='/assets/icons/smile.svg'
                                    width={33}
                                    height={33}
                                    alt='smile' />
                                <MannerText>매너 평가하기</MannerText>
                            </ImageBox>
                            <ImageBox>
                                <Image
                                    src='/assets/icons/sad.svg'
                                    width={33}
                                    height={33}
                                    alt='sad' />
                                <MannerText>비매너 평가하기</MannerText>
                            </ImageBox>
                        </ImageWrapper>
                    </ImageTop>
                    :
                    <TextTop>
                        {children}
                    </TextTop>}
            </Main>
            <Footer>
                <Buttons $type={type}>
                    <Button className={type === 'img' ? 'yesButton' : 'noButton'} $type={type}>{type === 'yesOrNo' ? '예' : '확인'}</Button>
                    {type === 'yesOrNo' && <Button className='noButton' $type={type}>아니요</Button>}
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

const ImageBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const MannerText = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:#2D2D2D;
    margin-top: 11px;
`

const Footer = styled.footer`
    height: auto;
`

const Buttons = styled.div<{ $type: string }>`
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
    color:#44515C;
    width:100%;
    padding:15px 0;
    &.yesButton {

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