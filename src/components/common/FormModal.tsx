import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface FormModalProps {
    type: 'checkbox' | 'text';
    title: string;
    width: string;
    closeButtonWidth: number;
    closeButtonHeight: number;
    borderRadius: string;
    children: string | React.ReactNode;
    buttonText: string;
}

const FormModal = (props: FormModalProps) => {
    const { type, title, width, closeButtonWidth, closeButtonHeight, borderRadius, children, buttonText } = props;
    return (
        <Wrapper $width={width} $borderRadius={borderRadius}>
            <Header $type={type}>
                {type === 'checkbox' && <CheckboxTitle>{title}</CheckboxTitle>}
                <CloseButton>
                    <CloseImage
                        src='/assets/icons/close.svg'
                        width={closeButtonWidth}
                        height={closeButtonHeight}
                        alt='close button' />
                </CloseButton>
            </Header>
            <main>
                <div>
                    {type === 'text' && <TextTitle>{title}</TextTitle>}
                </div>
                <div>{children}</div>
            </main>
            <footer>
                <p>
                    <button></button>
                </p>
            </footer>
        </Wrapper >
    )
};

export default FormModal;

const Wrapper = styled.div<{ $type: string, $width: string, $borderRadius: string }>`
    box-shadow: 0 0 21.3px 0px rgba(0, 0, 0, 0.15);
    background: ${theme.colors.white};
    width:${(props) => props.$width};
    border-radius: ${(props) => props.$borderRadius};
    padding:${({ $type }) =>
        $type === 'checkbox'
            ? '26px 31px 0'
            : '29px 37px 0'};  
`

const Header = styled.header<{ $type: string }>` 
    display: ${({ $type }) =>
        $type === 'checkbox'
            ? 'flex'
            : 'block'};
    align-items: center;
    justify-content:space-between;
     
`

const CheckboxTitle = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.purple100};
`

const CloseButton = styled.p`
    display:flex;
`

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`

const TextTitle = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.purple100};
`