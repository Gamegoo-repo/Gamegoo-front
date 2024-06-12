import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "./CRModal";
import UserInfo from "./UserInfo";
import Button from "../common/Button";
import PositionBox from "./PositionBox";
import Image from "next/image";
import { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

interface ReadBoardProps {
    onClose: () => void;
    postId: number;
}

const champions = [
    '/assets/icons/gray_circle.svg',
    '/assets/icons/gray_circle.svg',
    '/assets/icons/gray_circle.svg'
];

const ReadBoard = (props: ReadBoardProps) => {
    const { onClose, postId } = props;

    const [textareaValue, setTextareaValue] = useState("");


    return (
        <CRModal
            type='reading'
            onClose={onClose}>
            <UserInfo status="reading" />
            <FirstSection>
                <Champions>
                    <Title>최근 선호 챔피언</Title>
                    <Champion>
                        {champions.map((champion, index) => (
                            <Image
                                key={index}
                                src={champion}
                                width={50}
                                height={50}
                                alt="champion image"
                            />
                        ))}
                    </Champion>
                </Champions>
                <Queue>
                    <Title>큐타입</Title>
                    <Type>
                        <P>솔로 랭크</P>
                    </Type>
                </Queue>
            </FirstSection>
            <PositionSection>
                <Title>포지션</Title>
                <PositionBox status="reading" />
            </PositionSection>
            <WinningRate>
                <RateFirstRow>
                    <Left>
                        <WinningTitle>승률</WinningTitle>
                        <Percent>76%</Percent>
                    </Left>
                    <Right>
                        <History>
                            글 작성 시점 최근 20게임
                        </History>
                    </Right>
                </RateFirstRow>
                <RateSecondRow>
                    <ProgressBar
                        completed={76}
                        maxCompleted={100}
                        className="wrapper"
                        barContainerClassName="container"
                        completedClassName="barCompleted"
                        labelClassName="label"
                    />
                </RateSecondRow>

            </WinningRate>
            <StyleSection>
                <Title>게임 스타일</Title>
            </StyleSection>
            <MemoSection>
                <Title>메모</Title>
                <Memo>
                    <MemoData>
                        가볍게 같이 즐기실 분 구해요 !
                    </MemoData>
                </Memo>
            </MemoSection>
            <ButtonContent>
                <Button type="submit" buttonType="primary" text="말 걸어보기" />
            </ButtonContent>
        </CRModal>
    )
};

export default ReadBoard;

const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
    margin-bottom:4px;
`;

const FirstSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:118px;
    margin-top:24px;    
`;

const Champions = styled.div``;

const Champion = styled.div`
    display: flex;
    align-items: center;
    gap:9px;
`;

const Queue = styled.div``;

const Type = styled.div`
    border: 1px solid ${theme.colors.gray300};  
    border-radius: 11px;
    padding:11px 202px 11px 21px;  
`;

const P = styled.p`
    ${(props) => props.theme.fonts.regular18};
    color: #606060;
`;

const PositionSection = styled.div`
    margin-top:19px;    
`;

const WinningRate = styled.div`
    margin-top:23px;    
`;

const RateFirstRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:6px;
`;

const RateSecondRow = styled.div`
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
   width: 76%;
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

const StyleSection = styled.div`
    margin-top:31px;    
`;

const MemoSection = styled.div`
    margin-top:27px;    
`;

const Memo = styled.div`
    width: 100%;
    min-height: 100px;
    padding: 11px 20px;
    border-radius: 15px;
    border: 1px solid ${theme.colors.purple300};  
`;

const MemoData = styled.p`
    color: #606060;
    ${(props) => props.theme.fonts.regular20}
`;

const ButtonContent = styled.p`
    padding:0 45px 36px;
    margin-top:22px;    
    text-align: center;
`;