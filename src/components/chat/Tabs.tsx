import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Dispatch } from "react";

interface TabsProps {
  tabs: string[];
  activeTab: number;
  onTabClick: (index: number) => void;
}

const Tabs = (props: TabsProps) => {
  const { tabs, activeTab, onTabClick } = props;
  return (
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
  );
};

export default Tabs;

const TabContainer = styled.div`
  display: flex;
  gap: 40px;
  padding: 0 30px;
`;

const TabButton = styled.div<{ $isActive: boolean }>`
  position: relative;
  padding: 4px 0;
  cursor: pointer;
  ${(props) =>
    props.$isActive ? props.theme.fonts.bold14 : props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: ${(props) => (props.$isActive ? "100%" : "none")};
    height: 4px;
    background-color: ${theme.colors.violet600};
    border-radius: 60px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
`;
