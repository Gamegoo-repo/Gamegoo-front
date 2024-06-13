import styled from "styled-components";
import { theme } from "@/styles/theme";
import CRModal from "../crBoard/CRModal";
import Button from "../common/Button";
import PositionBox from "../crBoard/PositionBox";
import Image from "next/image";
import { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import ProfileImage from "./ProfileImage";
import User from "../crBoard/User";
import MannerLevel from "./MannerLevel";
import Mic from "./Mic";
import Report from "./Report";

interface ReadBoardProps {
    onClose: () => void;
    postId: number;
}

const champions = [
    '/assets/icons/gray_circle.svg',
    '/assets/icons/gray_circle.svg',
    '/assets/icons/gray_circle.svg'
];

interface userInfo {
    image: string;
    account: string;
    tag: string;
    tier: string;
    manner_level: number;
    mic: number;
}

const userData = {
    image: "/assets/icons/profile_img.svg",
    account: "유니콘의 비밀",
    tag: "KR1",
    tier: "B3",
    manner_level: 5,
    mic: 0,
};

const ReadBoard = (props: ReadBoardProps) => {
    const { onClose, postId } = props;

    const [textareaValue, setTextareaValue] = useState("");

    // const [user, setUser] = useState<userInfo>()

    // TODO: api 연결
    // useEffect(() => {
    //     axios.get('http://localhost:3001/user')
    //         .then(response => {
    //             setUser(response.data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, [])

    return (
        <CRModal
            type='reading'
            onClose={onClose}>
            <UserSection>
                <UserLeft>
                    <ProfileImage
                        image={userData.image} />
                    <UserNManner>
                        <User
                            account={userData.account}
                            tag={userData.tag}
                            tier={userData.tier} />
                        <MannerLevel
                            level={userData.manner_level} />
                    </UserNManner>
                </UserLeft>
                <UserRight>
                    <Mic
                        status={userData.mic} />
                    <Report />
                </UserRight>
            </UserSection>
            <QueueSection>
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
            </QueueSection>
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

const UserSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:176px;
`;

const UserLeft = styled.div`
    display:flex;
    align-items: center;
`;
const UserNManner = styled.div`
    display:flex;
`;
const UserRight = styled.div`
    display:flex;
`;
const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
    margin-bottom:4px;
`;

const QueueSection = styled.div`
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