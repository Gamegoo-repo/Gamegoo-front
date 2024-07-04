import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import ChatWindow from './ChatWindow';
import { useEffect, useState } from 'react';
import MessageContainer from './MessageContainer';

interface ChatRoomProps {
    id: number;
}

const MESSAGE_LIST = [
    { user: "me", msg: '안녕하세요 저는 안녕하세요 저는 안녕하세요 저는', msgId: 1, userId: 1, date: "2024-07-01 23:27" },
    { user: "me", msg: '텍스트 텍스', msgId: 2, userId: 1, date: "2024-07-01 23:27" },
    { user: "you", msg: '아 네, 안녕하세요 하이하이라라', msgId: 3, userId: 2, date: "2024-07-02 01:11" },
    { user: "you", msg: '하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라하이하이라라', msgId: 4, userId: 2, date: "2024-07-02 01:11" },
];

const ChatRoom = (props: ChatRoomProps) => {
    const { id } = props;

    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);


    // useEffect(() => {
    //     socket.on(“message”, (message) => {
    //     setMessageList((prevState)=> prevState.concat(message));
    // });
    // },[]);

    const sendMessage = (event: any) => {
        event.preventDefault();
        // socket.emit(“sendMessage”, message, (res) => {
        //     console.log(“res”, res);
        // })
        console.log(message)
    };



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
                    <Date>2024년 4월 5일</Date>
                    <MessageContainer
                        messageList={MESSAGE_LIST} />
                </ChatMain>
            </ChatBorder>
            <ChatFooter>
                <div className="input-area">
                    <form onSubmit={sendMessage} className="input-container">
                        <input
                            placeholder="Type in here…"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                        />

                        <button
                            disabled={message === ""}
                            type="submit"
                            className="send-button"
                        >
                            전송
                        </button>
                    </form>
                </div>
            </ChatFooter>
        </ChatWindow>
    )

};

export default ChatRoom;

const ChatHeader = styled.header`
    display: flex;
    align-items: center;
    padding:10px 27px 19px 12px;
`;

const ChatBorder = styled.div`
    padding: 0 12px;
`;

const ChatMain = styled.main`
    border-top: 1px solid #C1B7FF;
    padding:10px 20px;
`;
const System = styled.p`
    width: 100%;
    text-align: center;
    padding:11px 0px;
    background: #000000A3;
    ${(props) => props.theme.fonts.regular12};
    color: ${theme.colors.white}; 
    border-radius: 14px;
    margin-bottom: 11px;
`;

const Date = styled.p`
    max-width: 79px;
    margin: 0 auto 10px auto;
    text-align: center;
    background: #000000A3;
    border-radius: 14px;
    padding: 4px 10px;
    ${(props) => props.theme.fonts.regular8};
    color: ${theme.colors.white}; 
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