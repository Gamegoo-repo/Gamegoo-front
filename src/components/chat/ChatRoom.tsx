import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import ChatWindow from './ChatWindow';

interface ChatRoomProps {
    id: number;
}

const ChatRoom = (props: ChatRoomProps) => {
    const { id } = props;
    console.log(id)
    return (
        <ChatWindow>
            <ChatHeader>
                <PrevImage
                    src="/assets/icons/left_arrow.svg"
                    width={9}
                    height={18}
                    alt="뒤로가기" />
                <Middle>
                    <Image
                        src="/assets/icons/gray_circle.svg"
                        width={47.43}
                        height={47.43}
                        alt="프로필 이미지" />
                    <Div>
                        <UserName>김철수</UserName>
                        <Online>온라인</Online>
                        <OnlineImage
                            src="/assets/icons/online.svg"
                            width={5}
                            height={5}
                            alt="온라인" />
                    </Div>
                </Middle>
                <Image
                    src="/assets/icons/three_dots_button.svg"
                    width={3}
                    height={15}
                    alt="상세보기" />
            </ChatHeader>
            <ChatBorder>
                <ChatMain>
                    <System>매칭이 이루어졌어요 !</System>
                    <Date>2024년 5월 7일</Date>
                </ChatMain>
            </ChatBorder>
            <ChatFooter></ChatFooter>
        </ChatWindow>
    )

};

export default ChatRoom;

const ChatHeader = styled.header`
    display: flex;
    align-items: center;
    padding:10px 27px 19px 12px;
`;

const ChatBorder = styled.p`
    padding: 0 12px;
`;

const ChatMain = styled.main`
    border-top: 1px solid #C1B7FF;
    padding:10px 20px;
`;
const System = styled.p`
    width: 100%;
    text-align: center;
    padding:11px 0%;
    background: #000000A3;
    ${(props) => props.theme.fonts.regular12};
    color: ${theme.colors.white}; 
    border-radius: 14px;
`;

const Date = styled.p`
    color: ${theme.colors.white}; 
    padding: 4px 10px;
`;
const ChatFooter = styled.footer``;

const PrevImage = styled(Image)`
    margin-right:18px;
    cursor: pointer;
`;

const Middle = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;
const Div = styled.div`
    position: relative;
    margin-left:9px;
`;
const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: ${theme.colors.gray600}; 
`;
const Online = styled.p`
   ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
`;
const OnlineImage = styled(Image)`
    position: absolute;
    top: 1%;
    right: -11%;
`;