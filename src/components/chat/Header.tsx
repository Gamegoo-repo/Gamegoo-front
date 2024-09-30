import styled, { keyframes } from 'styled-components';
import { theme } from "@/styles/theme";
import Image from "next/image";
import { Dispatch } from 'react';

interface HeaderProps {
    title: string;
    tabs: string[];
    activeTab: number;
    onTabClick: Dispatch<React.SetStateAction<number>>;
}
const Header = (props: HeaderProps) => {
    const { title, tabs, activeTab, onTabClick } = props;
    return (
        <div>
            <HeaderTitle>
                {title}
            </HeaderTitle>
            <TabContainer>
                {tabs.map((tab, index) => (
                    <TabButton
                        key={index}
                        onClick={() => onTabClick(index)}
                        $isActive={activeTab === index}
                    >
                        {tab}
                    </TabButton>
                ))}
            </TabContainer>
        </div>

    )
};

export default Header;

const HeaderTitle = styled.p`
    padding: 0 30px;
    ${(props) => props.theme.fonts.bold20};
    color:${theme.colors.gray600};
    margin-bottom: 38px;
`;

const TabContainer = styled.div`
    display: flex;
    gap:40px;
    padding: 0 30px;
`;

const TabButton = styled.div<{ $isActive: boolean }>`
    position: relative;
    padding: 4px 0;
    cursor: pointer;
    ${(props) =>
        props.$isActive
            ? props.theme.fonts.bold14
            : props.theme.fonts.semiBold14};
    color:${theme.colors.gray600};
    &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -2px;
        width: ${(props) => (props.$isActive ? '100%' : 'none')};
        height: 4px;
        background-color: ${theme.colors.purple100}; 
        border-radius: 60px;
        transform: translateX(-50%);
        transition: width 0.3s ease;
    }

`;