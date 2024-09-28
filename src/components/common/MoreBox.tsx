import styled from "styled-components";
import { theme } from "@/styles/theme";
import { MoreBoxMenuItems } from "@/interface/moreBox";

interface MoreBoxProps {
    items: MoreBoxMenuItems[];
    top: number;
    right: number;
}

const MoreBox = ({ items, top, right }: MoreBoxProps) => {
    return (
        <MenuWrapper $top={top} $right={right}>
            {items.map((item, index) => (
                <MenuItem key={index} onClick={item.onClick}>
                    {item.text}
                </MenuItem>
            ))}
        </MenuWrapper>
    )
};

export default MoreBox;

const MenuWrapper = styled.div<{ $top: number; $right: number }>`
    width: 175px;
    position: absolute;
    top: ${props => props.$top}px;
    right: ${props => props.$right}px;
    z-index: 100;
    box-shadow: 0 0 21.3px 0 #00000026;
    background: ${theme.colors.white}; 
    border-radius: 10px;
`;

const MenuItem = styled.div`
    ${(props) => props.theme.fonts.medium15};
    color: #555555;
    white-space: nowrap;
    cursor: pointer;
    padding:9px 0 9px 20px;
    border-bottom: 1px solid ${theme.colors.gray400};
    &:last-child {
        border-bottom: none;
    }
`;