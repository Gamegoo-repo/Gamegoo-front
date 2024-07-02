import styled from 'styled-components';
import { theme } from "@/styles/theme";

interface TabContentProps {
    onActive: string;
}

const TabContent = (props: TabContentProps) => {
    const { onActive } = props;

    return (
        <Content>
            {onActive === 'friends' && <div>친구 목록</div>}
            {onActive === 'chat' && <div>대화방</div>}
        </Content>
    )

};

export default TabContent;

const Content = styled.div`
`;