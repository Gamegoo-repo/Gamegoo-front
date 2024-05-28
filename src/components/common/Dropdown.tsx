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
}

const Dropdown = (props: DropdownProps) => {
    const { type, name, list, width } = props;
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
                $width={width}>
                <Title>
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
                    >
                        {list.map(data => (
                            <ListItem
                                onClick={() => handleDropValue(data.value)} key={data.id}
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
};

export default Dropdown;

const Wrapper = styled.div``

const DropdownHeader = styled.div<{ $type: string, $width: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color:${theme.colors.black};
  border-radius: 10px;
  padding:16.5px 21px;
  background: ${({ $type }) => $type === 'type1' ? '#F5F5F5' : `${theme.colors.white}`};
  border:${({ $type }) =>
        $type === 'type2'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
  width:${({ $width }) => $width};
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
`

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