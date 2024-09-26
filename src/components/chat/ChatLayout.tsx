import styled from "styled-components";
import { theme } from "@/styles/theme";
import MessageHeader from "./MessageHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@/redux/slices/chatSlice";
import { Chat, DesignedSystemMessage } from "@/interface/chat";
import { enterUsingBoardId, enterUsingMemberId, enterUsingUuid } from "@/api/chat";
import { RootState } from "@/redux/store";
import { socket } from "@/socket";

interface System {
    flag: number;
    boardId: number;
}

interface ChatLayoutProps {
    apiType: number;
}

const ChatLayout = (props: ChatLayoutProps) => {
    const { apiType } = props;
    const dispatch = useDispatch();

    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState(false);
    const [chatEnterData, setChatEnterData] = useState<Chat>();
    const [systemMessage, setSystemMessage] = useState<DesignedSystemMessage>();
    const [isSystemMsg, setIsSystemMsg] = useState<System>();
    const [isSystemMsgSent, setIsSystemMsgSent] = useState(false); // 첫번째 메시지 이후 systemMsg 보내지 않기 위한 상태변경
    const [message, setMessage] = useState("");

    const isChatRoomOpen = useSelector((state: RootState) => state.chat.isChatRoomOpen);
    const isChatUuid = useSelector((state: RootState) => state.chat.isChatRoomUuid);

    const handleOutsideModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (isMoreBoxOpen) {
            setIsMoreBoxOpen(false);
        }
    };

    // const handleChatEnter = async (id: string | number, type: 'chatRoom' | 'friend') => {
    //     try {
    //         if (type === 'chatRoom' && typeof id === "string") {
    //             const data = await enterUsingUuid(id);
    //             setChatEnterData(data.result);
    //         } else if (type === 'friend' && typeof id === "number") {
    //             const data = await enterUsingMemberId(id);
    //             setChatEnterData(data.result);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // useEffect(() => {
    //     if (isChatRoomOpen && isChatUuid) {
    //         handleChatEnter(isChatUuid, 'chatRoom'); // 필요시 호출
    //     }
    // }, [isChatRoomOpen, isChatUuid]);

    /* 채팅방 입장 */
    useEffect(() => {
        const handleChatEnter = async () => {
            if (!isChatUuid) return;

            try {
                // 친구목록에서 채팅방 입장
                if (apiType === 0 && typeof isChatUuid === "number") {
                    const data = await enterUsingMemberId(isChatUuid);
                    setChatEnterData(data.result);
                    console.log('xcvxcvcx', data.result)
                    // onMemberId(data.result.memberId);
                    // dispatch(setCurrentChatUuid(data.result.uuid));
                }

                // 대화방에서 채팅방 입장
                if (apiType === 1 && typeof isChatUuid === "string") {
                    const data = await enterUsingUuid(isChatUuid);
                    setChatEnterData(data.result);
                    // onMemberId(data.result.memberId);
                    // dispatch(setCurrentChatUuid(data.result.uuid));
                }

                // 게시글에서 채팅방 입장
                if (apiType === 3 && typeof isChatUuid === "number") {
                    const data = await enterUsingBoardId(isChatUuid);
                    setChatEnterData(data.result);
                    // onMemberId(data.result.memberId);
                    // dispatch(setCurrentChatUuid(data.result.uuid));
                    setIsSystemMsg(data.result.system);

                    //실시간으로 시스템 메시지 보여주기 위함
                    let systemMessage: DesignedSystemMessage;
                    if (data.result.system.flag === 1) {
                        systemMessage = {
                            senderId: 0,
                            senderName: "SYSTEM",
                            senderProfileImg: 0,
                            message: "상대방이 게시한 글을 보고 말을 걸었어요. 대화를 시작해보세요~",
                            createdAt: null,
                            timestamp: null,
                            boardId: data.result.system.boardId,
                        };
                    } else {
                        systemMessage = {
                            senderId: 0,
                            senderName: "SYSTEM",
                            senderProfileImg: 0,
                            message: "상대방이 게시한 글을 보고 말을 걸었어요.",
                            createdAt: null,
                            timestamp: null,
                            boardId: data.result.system.boardId,
                        };
                    }

                    setSystemMessage(systemMessage);
                }
            } catch (err) {
                const error = err as AxiosError<ErrorResponse>;
                console.log(error.message);
                if (error) {
                    dispatch(setErrorMessage(error.message));
                } else {
                    dispatch(setErrorMessage("알 수 없는 오류가 발생했습니다."));
                }
            }
        };

        handleChatEnter();
    }, [isChatUuid]);

    /* 메시지 보내기 */
    const sendMessage = (event: any) => {
        event.preventDefault();
        if (message.trim()) {
            let emitData;

            if (chatEnterData?.system) {
                // chatEnterData.system이 있는 경우
                if (!isSystemMsgSent) {
                    // 첫 번째 메시지일 경우, system 값을 포함
                    emitData = {
                        uuid: chatEnterData.uuid,
                        message: message,
                        system: isSystemMsg,
                    };
                    setIsSystemMsgSent(true); // 시스템 메시지를 보낸 후, 상태를 true로 설정
                } else {
                    // 이후 메시지에는 system 값을 포함시키지 않음
                    emitData = {
                        uuid: chatEnterData.uuid,
                        message: message,
                    };
                }
            } else {
                // chatEnterData.system이 없는 경우
                emitData = {
                    uuid: chatEnterData?.uuid,
                    message: message,
                };
            }

            socket.emit("chat-message", emitData);
            setMessage("");
        }
    };

    return (
        <Overlay>
            {isChatRoomOpen && isChatUuid !== null &&
                <Wrapper onClick={handleOutsideModalClick}>
                    <MessageHeader
                        isMoreBoxOpen={isMoreBoxOpen}
                        setIsMoreBoxOpen={setIsMoreBoxOpen}
                        chatEnterData={chatEnterData} />
                    <MessageList
                        chatEnterData={chatEnterData}
                        systemMessage={systemMessage}

                    />
                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        chatEnterData={chatEnterData}
                    />
                </Wrapper>
            }
        </Overlay>
    )
};

export default ChatLayout;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    position: relative;
    background: ${theme.colors.purple400};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
`;