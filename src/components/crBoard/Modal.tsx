import styled from "styled-components";
import { theme } from "@/styles/theme";
import Button from "../common/Button";
import Image from "next/image";
import { createPortal } from 'react-dom';

interface BoardModalProps {
    type: 'writing' | 'reading';
    width: string;
    height: string;
    onClose: () => void;
    children: string | React.ReactNode;
    buttonText: string;
    disabled?: boolean
}

const Modal = (props: BoardModalProps) => {
    const {
        type,
        children,
        onClose,
        disabled
    } = props;

    const modalRoot = document.getElementById('modal-root') as HTMLElement;

    return createPortal(
        <Overlay>
            <Wrapper>
                <Header $type={type}>
                    {type === 'reading' && <CheckboxTitle>게시일 : 24.05.06. 12:45</CheckboxTitle>}
                    <CloseButton>
                        <CloseImage
                            onClick={onClose}
                            src='/assets/icons/close.svg'
                            width={17}
                            height={17}
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

export default Modal;

const Overlay = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    box-shadow: 0 0 21.3px 0 rgba(0, 0, 0, 0.15);
    background: ${theme.colors.white};
    border-radius: 20px;
`;

const Header = styled.header<{ $type: string }>` 
    display: ${({ $type }) =>
        $type === 'checkbox'
            ? 'flex'
            : 'block'};
    align-items: center;
    justify-content:space-between;
    padding:24px 23px 0 0;
`;

const CheckboxTitle = styled.p`
    ${(props) => props.theme.fonts.bold22};
    color:${theme.colors.black};
`;

const CloseButton = styled.p`
    display:flex;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const Main = styled.main`
    padding:0 45px;
`;

const MainContent = styled.div`
`;