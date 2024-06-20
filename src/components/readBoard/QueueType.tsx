import styled from "styled-components";
import { theme } from "@/styles/theme";

interface QueueTypeProps {
    value: string;
}

const QueueType = (props: QueueTypeProps) => {
    const { value } = props;

    return (
        <Queue>
            <Title>큐타입</Title>
            <Type>
                <P>{value}</P>
            </Type>
        </Queue>
    )
};

export default QueueType;

const Queue = styled.div`
    width: 234px;
`;

const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: #222222;
    margin-bottom:5px;
`;

const Type = styled.div`
    border: 1px solid ${theme.colors.gray300};  
    border-radius: 11px;
    padding:11px 0 11px 21px;  
`;

const P = styled.p`
    ${(props) => props.theme.fonts.regular18};
    color: #606060;
`;