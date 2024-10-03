import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { createPortal } from 'react-dom';

interface BoardModalProps {
    type: 'posting' | 'reading';
    onClose: () => void;
    children: string | React.ReactNode;
}

const CRModal = (props: BoardModalProps) => {
    const {
        type,
        children,
        onClose,
    } = props;

    const modalRoot = document.getElementById('modal-root') as HTMLElement;

    return createPortal(
        <Overlay>
            <Wrapper>
                <Header $type={type}>
                    <CloseButton $type={type}>
                        <CloseImage
                            onClick={onClose}
                            src='/assets/icons/close.svg'
                            width={15}
                            height={15}
                            alt='close button' />
                    </CloseButton>
                </Header>
                <Main>
                    <MainContent>{children}</MainContent>
                </Main>
            </Wrapper>
        </Overlay>
        , modalRoot
    )
};

export default CRModal;

const Overlay = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    top:50%;
    left:50%;
    z-index: 100;
    background: #0000009C;
    inset: 0;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    box-shadow: 0 4px 96.4px 0 #00000040;
    max-width:555px;
    width: 100%;
    min-height: 837px;
    position: relative;
`;

const Header = styled.header<{ $type: string }>` 
    padding: 26px 30px 0 0;
`;

const CloseButton = styled.p<{ $type: string }>`
    display:flex;
    margin-bottom:${({ $type }) =>
        $type === 'reading'
            ? '1px'
            : '8px'};
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const Main = styled.main``;

const MainContent = styled.div`
    padding: 0 34px;
`;