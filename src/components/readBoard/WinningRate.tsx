import styled from "styled-components";
import { theme } from "@/styles/theme";
import ProgressBar from "@ramonak/react-progress-bar";

interface WinningRateProps {
    completed: number;
    history: number;
}

const WinningRate = (props: WinningRateProps) => {
    const { completed, history } = props;
    return (
        <>
            <FirstRow>
                <Left>
                    <WinningTitle>승률</WinningTitle>
                    <Percent>{completed}%</Percent>
                </Left>
                <Right>
                    <History>
                        글 작성 시점 최근 {history}게임
                    </History>
                </Right>
            </FirstRow>
            <SecondRow $completed={completed}>
                <ProgressBar
                    completed={completed}
                    maxCompleted={100}
                    className="wrapper"
                    barContainerClassName="container"
                    completedClassName="barCompleted"
                    labelClassName="label"
                />
            </SecondRow>
        </>
    )
};

export default WinningRate;

const FirstRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:6px;
`;

const SecondRow = styled.div<{ $completed: number }>`
    .wrapper{
    height: 20px;
}
    .container {
    background: linear-gradient(90deg, #FF7474 63.45%, #FF5252 100%);
    border-radius: 11px;
}
    .barCompleted {
   background: linear-gradient(90deg, #342688 0, #5A42EE 100%);
   border-radius: 11px 0 0 11px;
   width: ${({ $completed }) => $completed}%;
} 
    .label{
    color:transparent;
}
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap:11px;
`;

const Right = styled.div``;

const WinningTitle = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
`;

const Percent = styled.p`
    color: ${theme.colors.purple100};
    ${(props) => props.theme.fonts.semiBold18};
`;

const History = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color: ${theme.colors.gray300};;
`;