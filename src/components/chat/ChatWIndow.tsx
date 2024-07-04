import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

interface ChatWindowProps {
    onClose?: () => void;
    children: false | React.ReactNode;
}

const ChatWindow = (props: ChatWindowProps) => {
    const { onClose, children } = props;

    return (
        <Overlay>
            <Wrapper>
                <Shadow>
                    <CloseButton>
                        <CloseImage
                            onClick={onClose}
                            src='/assets/icons/close.svg'
                            width={11}
                            height={11}
                            alt='close button' />
                    </CloseButton>
                    {children}
                </Shadow>
            </Wrapper>
        </Overlay>
    )
};

export default ChatWindow;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 400px;
`;

const Shadow = styled.div`
    box-shadow: 0 -1px 10.7px 0 #00000026;
    border-radius: 20px 20px 20px 20px;
`;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;




