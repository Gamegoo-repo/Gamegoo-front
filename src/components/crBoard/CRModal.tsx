import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { createPortal } from 'react-dom';

interface BoardModalProps {
    type: 'posting' | 'reading';
    onClose: () => void;
    children: string | React.ReactNode;
    disabled?: boolean
}

const CRModal = (props: BoardModalProps) => {
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
                    {type === 'reading' && <UpdatedDate>게시일 : 24.05.06. 12:45</UpdatedDate>}
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

export default CRModal;

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
    /* position: relative; */
    box-shadow: 0 0 21.3px 0 rgba(0, 0, 0, 0.15);
    background: ${theme.colors.white};
    border-radius: 20px;
`;

const Header = styled.header<{ $type: string }>` 
    display: ${({ $type }) =>
        $type === 'reading'
            ? 'flex'
            : 'block'};
    align-items: center;
    justify-content:space-between;
    padding: ${({ $type }) =>
        $type === 'reading'
            ? '24px 23px 0 43px'
            : '24px 23px 0 0'};
    margin-bottom:${({ $type }) =>
        $type === 'reading'
            ? '24px'
            : 'unset'};
`;

const UpdatedDate = styled.p`
    ${(props) => props.theme.fonts.medium14};
    color:${theme.colors.gray200};
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