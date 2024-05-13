import Image from "next/image";
import { useState } from "react";
import { theme } from "@/styles/theme";
import styled from "styled-components";

const DROP_DATA = [
    { id: null, value: '솔로 랭크' },
    { id: 1, value: '솔로 랭크1' },
    { id: 2, value: '솔로 랭크3' },
    { id: 3, value: '솔로 랭크3' },
];

interface DropdownProps {
    type: string
    width: string
    fontSize: string,
    bgColor: string
}

const Dropdown = (props: DropdownProps) => {
    const { type, width, fontSize, bgColor } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('솔로 탱크');

    const toggling = () => setIsOpen(!isOpen);

    const handleDropValue = (value: string) => {
        console.log(value)
        setSelectedOption(value);
        setIsOpen(false);
        console.log(selectedOption);
    };

    return (
        <div>
            <DropDownHeader
                onClick={toggling}
                type={type}
                $width={width}
                $fontSize={fontSize}
                $bgColor={bgColor}>
                <Title type={type}>
                    {selectedOption || '솔로 랭크'}
                </Title>
                <Image
                    src='/assets/icons/down_arrow.svg'
                    width={16}
                    height={9}
                    alt='down-arrow' />
            </DropDownHeader>
            {isOpen && (
                <div>
                    <DropDownList
                        $width={width}
                        $bgColor={bgColor}
                    >
                        {DROP_DATA.map(data => (
                            <ListItem
                                onClick={() => handleDropValue(data.value)} key={data.id}
                                $width={width}
                                $fontSize={fontSize}
                                $bgColor={bgColor}>
                                {data.value}
                            </ListItem>
                        ))}
                    </DropDownList>
                </div>
            )}
        </div>
    )
};

export default Dropdown;


const DropDownHeader = styled.div<{ type: string, $width: string, $fontSize: string, $bgColor: string }>`
  display: flex;
  align-items: center;
  color:${theme.colors.black};
  border-radius: 10px;
  padding:18px 0;
  padding-left: 1em;
  background: ${(props) => props.$bgColor};
  border:${({ type }) =>
        type === 'writing'
            ? `1px solid ${theme.colors.gray300}`
            : 'none'};
  width:${(props) => props.$width};
  ${(props) => props.$fontSize};
  cursor: pointer;
`;

const Title = styled.p<{ type: string }>`
    padding-right: ${(props) => props.type === 'bulletin' ? '20px' : '127px'};
`;

const DropDownList = styled.ul<{ $width: string, $bgColor: string }>`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  border-radius: 10px;
  background: ${(props) => props.$bgColor};
  border: 1px solid ${(props) => props.$bgColor};
  box-sizing: border-box;
  padding: 0.8em;
  width:${(props) => props.$width};
`;

const ListItem = styled.li<{ $width: string, $fontSize: string, $bgColor: string }>`
  list-style: none;
  border-radius: 10px;
  color:${theme.colors.black};
  ${(props) => props.$fontSize};
  cursor: pointer;
`;