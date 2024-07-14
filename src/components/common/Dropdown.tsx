import Image from "next/image";
import { Dispatch, forwardRef } from "react";
import { theme } from "@/styles/theme";
import styled from "styled-components";

interface ListProps {
    id: number;
    value: string;
};

interface DropdownProps {
    type: 'type1' | 'type2';
    padding: string;
    list: ListProps[];
    width: string;
    open: boolean;
    setOpen: Dispatch<React.SetStateAction<boolean>>;
    onDropValue: (value: string) => void;
    defaultValue: string;
};

const Dropdown = forwardRef(function Dropdown(props: DropdownProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { type, list, width, open, padding, setOpen, onDropValue, defaultValue } = props;

    const toggling = () => setOpen((prevState) => !prevState);

    return (
        <Wrapper
            $width={width}
            ref={ref}>
            <DropdownHeader
                onClick={toggling}
                $type={type}
                $width={width}
                $padding={padding}>
                <Title>
                    {defaultValue}
                </Title>
                <Image
                    src='/assets/icons/down_arrow.svg'
                    width={16}
                    height={9}
                    alt='down-arrow' />
            </DropdownHeader>
            {open && (
                <DropBox>
                    <DropdownListContent
                        $type={type}
                        $width={width}
                    >
                        {list.map(data => (
                            <ListItem
                                onClick={() => onDropValue(data.value)} key={data.id}
                                className={type}
                                $type={type}
                                $width={width}>
                                {data.value}
                            </ListItem>
                        ))}
                    </DropdownListContent>
                </DropBox>
            )}
        </Wrapper>
    )
});

export default Dropdown;

const Wrapper = styled.div<{ $width: string }>`
    width:${({ $width }) => $width};
`;

const DropdownHeader = styled.div<{ $type: string, $width: string, $padding: string }>`
    display: flex;
    align-items: center;
    justify-content: space-between;
    color:${theme.colors.black};
    border-radius: 10px;
    padding:${({ $padding }) => $padding};
    background: ${({ $type }) => $type === 'type1' ? `${theme.colors.gray500}` : `${theme.colors.white}`};
    border:${({ $type }) =>
        $type === 'type2'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
    ${({ $type }) =>
        $type === 'type1'
            ? `${theme.fonts.medium16}`
            : `${theme.fonts.regular18}`};
    cursor: pointer;
`;

const Title = styled.p``;

const DropBox = styled.div`
    position: absolute;
    background: ${theme.colors.white};
    z-index:1;
`;

const DropdownListContent = styled.ul<{ $type: string, $width: string }>`
    padding: 0;
    margin: 0;
    border-radius: 10px;
    background: ${({ $type }) => $type === 'type1' ? '#F5F5F5' : `${theme.colors.white}`};
    border:${({ $type }) =>
        $type === 'type2'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
    box-sizing: border-box;
    width:${(props) => props.$width};
`;

const ListItem = styled.li<{ $type: string, $width: string }>`
    list-style: none;
    color:${theme.colors.black};
    ${({ $type }) =>
        $type === 'type1'
            ? `${theme.fonts.medium16}`
            : `${theme.fonts.regular18}`};
    padding:10px 16px;
    cursor: pointer;
    &.type1{
        &:hover{
            &:first-child {
                border-radius: 10px 10px 0 0;
            } 
            &:last-child {
                border-radius: 0 0 10px 10px;
            }
            color:${theme.colors.white};
            background: ${theme.colors.purple100};
        }
    }

    &.type2{
        &:hover{
            &:first-child {
                border-radius: 10px 10px 0 0;
            } 
            &:last-child {
                border-radius: 0 0 10px 10px;
            }
            color:${theme.colors.purple100};
            background: #F9F8FF;
        }
    }     
`;