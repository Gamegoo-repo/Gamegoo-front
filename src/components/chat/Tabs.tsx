import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from "@/styles/theme";

const Tabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('friends');

    return (
        <>
            <TabContainer>
                <Tab $isActive={activeTab === 'friends'} onClick={() => setActiveTab('friends')}>
                    친구 목록
                </Tab>
                <Tab $isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')}>
                    대화방
                </Tab>
            </TabContainer>
            <Content>
                {activeTab === 'friends' && <div>친구 목록</div>}
                {activeTab === 'chat' && <div>대화방</div>}
            </Content>
        </>
    );
};

export default Tabs;

const TabContainer = styled.div`
  display: flex;
  gap:40px;
`;

const Tab = styled.div<{ $isActive: boolean }>`
  position: relative;
  padding: 4px 0;
  cursor: pointer;
  ${(props) => props.theme.fonts.semiBold14};
  color: #232323;
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

const Content = styled.div`
`;