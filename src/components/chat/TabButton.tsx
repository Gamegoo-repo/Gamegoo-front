import styled from 'styled-components';
import { theme } from "@/styles/theme";

interface TabButtonProps {
    onActive: string;
    handleActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabButton = (props: TabButtonProps) => {
    const { onActive, handleActiveTab } = props;
    return (
        <>
            <TabContainer>
                <Tab $isActive={onActive === 'friends'} onClick={() => handleActiveTab('friends')}>
                    친구 목록
                </Tab>
                <Tab $isActive={onActive === 'chat'} onClick={() => handleActiveTab('chat')}>
                    대화방
                </Tab>
            </TabContainer>
        </>
    );
};

export default TabButton;

const TabContainer = styled.div`
  display: flex;
  gap:40px;
  padding: 0 30px;
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