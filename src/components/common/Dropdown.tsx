import Image from "next/image";
import { useState } from "react";
import { theme } from "@/styles/theme";
import styled from "styled-components";

interface ListProps {
    id: number;
    value: string;
};

interface DropdownProps {
    type: 'type1' | 'type2';
    name: string;
    list: ListProps[];
    width: string;
    fontSize: string;
    bgColor: string;
}

const Dropdown = (props: DropdownProps) => {
    const { type, name, list, width, fontSize, bgColor } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>(name);

    const toggling = () => setIsOpen((prevState) => !prevState);

    const handleDropValue = (value: string) => {
        console.log(value)
        setSelectedOption(value);
        setIsOpen(false);
    };

    return (
        <Wrapper>
            <DropdownHeader
                onClick={toggling}
                $type={type}
                $width={width}
                $fontSize={fontSize}
                $bgColor={bgColor}>
                <Title type={type}>
                    {selectedOption || name}
                </Title>
                <Image
                    src='/assets/icons/down_arrow.svg'
                    width={16}
                    height={9}
                    alt='down-arrow' />
            </DropdownHeader>
            {isOpen && (
                <DropBox>
                    <DropdownListContent
                        $type={type}
                        $width={width}
                        $bgColor={bgColor}
                    >
                        {list.map(data => (
                            <ListItem
                                onClick={() => handleDropValue(data.value)} key={data.id}
                                className={type}
                                $width={width}
                                $fontSize={fontSize}
                                $bgColor={bgColor}>
                                {data.value}
                            </ListItem>
                        ))}
                    </DropdownListContent>
                </DropBox>
            )}
        </Wrapper>
    )
};

export default Dropdown;


const Wrapper = styled.div`
    
`

const DropdownHeader = styled.div<{ $type: string, $width: string, $fontSize: string, $bgColor: string }>`
  display: flex;
  align-items: center;
  ${({ $type }) =>
        $type === 'type2'
            ? `${theme.fonts.regular18}`
            : `${theme.fonts.medium16}`};
  color:${theme.colors.black};
  border-radius: 10px;
  padding:16.5px 0;
  padding-left: 1em;
  background: ${(props) => props.$bgColor};
  border:${({ $type }) =>
        $type === 'type2'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
  width:${(props) => props.$width};
  ${(props) => props.$fontSize};
  cursor: pointer;
`;

const Title = styled.p<{ type: string }>`
  padding-right: ${(props) => props.type === 'type1' ? '20px' : '120px'};
`;

const DropBox = styled.div`
    position: absolute;
    background: ${theme.colors.white};
    z-index:1;
`

const DropdownListContent = styled.ul<{ $type: string, $width: string, $bgColor: string }>`
  padding: 0;
  margin: 0;
  border-radius: 10px;
  background: ${(props) => props.$bgColor};
  border:${({ $type }) =>
        $type === 'type2'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
  box-sizing: border-box;
  width:${(props) => props.$width};
`;

const ListItem = styled.li<{ $width: string, $fontSize: string, $bgColor: string }>`
  line-height: 27px;
  list-style: none;
  color:${theme.colors.black};
  ${(props) => props.$fontSize};
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