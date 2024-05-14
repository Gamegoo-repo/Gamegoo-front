import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface ConfirmModalProps {
    type: 'yesOrNo' | 'confirm' | 'img';
    message?: string;
    width: string;
    height: string;
}
const ConfirmModal = (props: ConfirmModalProps) => {
    const { type, message, width, height } = props;

    return (
        <Overlay>
            <Wrapper $width={width} $height={height}>
                <Main>
                    {type === 'img' ?
                        <div>
                            <CloseButton>
                                <Image
                                    src="/assets/icons/close.svg"
                                    width={10}
                                    height={10}
                                    alt="close button" />
                            </CloseButton>
                            <ImageContent>

                            </ImageContent>
                        </div>
                        :
                        <div>
                            {message}
                        </div>}
                </Main>
                <footer>
                    <button></button>
                    <button></button>
                </footer>
            </Wrapper>
        </Overlay>
    )
};

export default ConfirmModal;

const Overlay = styled.div`
    
`

const Wrapper = styled.div<{ $width: string, $height: string }>`
    width:${(props) => props.$width};
    height:${(props) => props.$height};
    background: ${theme.colors.white};
    border-radius: 11px;
    box-shadow: 0px 0px 14.76px 0px rgba(0, 0, 0, 0.15);
`

const Main = styled.main`
    /* height: 110px; */
    /* border-bottom: 0.58px solid rgba(197, 197, 199, 1); */
`

const CloseButton = styled.p`
    display:flex;
    padding:13px 15px 0;
    img{
        margin-left:auto;
        cursor: pointer;
    }
`

const ImageContent = styled.div`
    display:flex;
    align-items: center;
`