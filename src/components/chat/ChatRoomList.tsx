import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import {
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  getChatrooms,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/api";
import { useChatList, useChatMessage } from "@/hooks";
import { setChatEnterType, setCurrentChatUuid } from "@/redux/slices/chatSlice";
import { setOpenModal } from "@/redux/slices/modalSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import type { ChatroomList, MoreBoxMenuItems } from "@/types";

import ChatRoomItem from "./ChatRoomItem";

interface ChatRoomListProps {
  onChatRoom: (id: string) => void;
  activeTab: number;
  isMoreBoxOpen: number | null;
  setIsMoreBoxOpen: React.Dispatch<React.SetStateAction<number | null>>;
  handleMoreBoxOpen: (
    chatId: number,
    uuid: string,
    room: ChatroomList,
    e: React.MouseEvent
  ) => void;
}

const ChatRoomList = (props: ChatRoomListProps) => {
  const {
    onChatRoom,
    activeTab,
    isMoreBoxOpen,
    setIsMoreBoxOpen,
    handleMoreBoxOpen,
  } = props;

  const dispatch = useDispatch();

  const isModalType = useSelector((state: RootState) => state.modal.modalType);
  const isUser = useSelector((state: RootState) => state.user);

  const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);
  const [reloadChatrooms, setReloadChatrooms] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { newMessage, mannerSystemMessage } = useChatMessage();

  /* 채팅방 목록 화면이 열려 있을 때만 joined-new-chatroom 이벤트를 리스닝 */
  useChatList(setChatrooms);

  /* 대화방 목록 가져오기  */
  const handleFetchChatrooms = async (cursor?: number) => {
    setIsLoading(true);
    try {
      const data = await getChatrooms({ cursor });
      console.log(data);
      setChatrooms(data.data.chatroomResponseList);
      setHasNext(data.data.has_next);
      setCursor(data.data.next_cursor);
      // 채팅방 읽음처리 하지 않기 위함
      dispatch(setCurrentChatUuid(""));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      handleFetchChatrooms();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isModalType, reloadChatrooms, activeTab, mannerSystemMessage, newMessage]
  );

  /* 대화 목록 페이지 - 스크롤이 끝에 도달하면 다음 페이지 가져오기 */
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!cursor) return;
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (hasNext && bottom && !isLoading) {
      handleFetchChatrooms(cursor);
    }
  };

  /* 상태 변경하여 useEffect 트리거 */
  const triggerReloadChatrooms = () => {
    setReloadChatrooms((prev) => !prev);
  };

  /* 새 메시지 오면 대화방 목록 업데이트 */
  useEffect(() => {
    if (newMessage) {
      triggerReloadChatrooms();
    }
  }, [newMessage]);

  /* 모달 타입 변경 */
  const handleChangeModal = async (e: React.MouseEvent, type: string) => {
    if (type) {
      e.stopPropagation();
    }

    dispatch(setOpenModal(type));
    setIsMoreBoxOpen(null);
  };

  /* 신고하기 */
  const handleReportClick = (e: React.MouseEvent) => {
    handleChangeModal(e, "report");
  };

  /* 매너 평가하기 */
  const handleMannerClick = (e: React.MouseEvent) => {
    handleChangeModal(e, "manner");
  };

  /* 비매너 평가하기 */
  const handleBadMannerClick = (e: React.MouseEvent) => {
    handleChangeModal(e, "badManner");
  };

  /* 더보기 버튼 친구 관련 */
  const handleFriendAction = (
    e: React.MouseEvent,
    action: string,
    room: ChatroomList
  ) => {
    setIsMoreBoxOpen(null);

    if (action === "delete") {
      handleFriendDelete(e, room.targetMemberId);
    } else if (action === "cancel") {
      handleCancelFriendReq(e, room.targetMemberId);
    } else if (action === "add") {
      handleFriendAdd(e, room.targetMemberId);
    } else if (action === "accept") {
      handleAcceptFriendReq(e, room.targetMemberId);
    } else if (action === "reject") {
      handleRejectFriendReq(e, room.targetMemberId);
    }
  };

  /* 더보기 버튼 상태 */
  const moreMenuItems = (room: ChatroomList): MoreBoxMenuItems[] => {
    const items: MoreBoxMenuItems[] = [
      { text: `채팅방 나가기`, onClick: (e) => handleChangeModal(e, "leave") },
    ];

    if (!!room.blind) {
      return items;
    }

    if (room.friend) {
      items.push({
        text: "친구 삭제",
        onClick: (e) => handleFriendAction(e, "delete", room),
      });
    } else if (!room.friend && room.friendRequestMemberId === isUser.id) {
      items.push({
        text: "친구 요청 취소",
        onClick: (e) => handleFriendAction(e, "cancel", room),
      });
    } else if (!room.friend && room.friendRequestMemberId === null) {
      items.push({
        text: "친구 추가",
        onClick: (e) => handleFriendAction(e, "add", room),
      });
    } else if (!room.friend && room.friendRequestMemberId !== isUser.id) {
      items.push(
        {
          text: "친구 요청 수락",
          onClick: (e) => handleFriendAction(e, "accept", room),
        },
        {
          text: "친구 요청 거절",
          onClick: (e) => handleFriendAction(e, "reject", room),
        }
      );
    }

    items.push(
      { text: `차단하기`, onClick: (e) => handleChangeModal(e, "block") },
      { text: `신고하기`, onClick: handleReportClick },
      { text: `매너 평가`, onClick: handleMannerClick },
      { text: `비매너 평가`, onClick: handleBadMannerClick }
    );

    return items;
  };

  /* 친구 추가 */
  const handleFriendAdd = async (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();
    try {
      await sendFriendRequest(memberId);
      triggerReloadChatrooms();
    } catch (error) {
      console.error(error);
    }

    if (setIsMoreBoxOpen) {
      setIsMoreBoxOpen(null);
    }
  };

  /* 친구 삭제 */
  const handleFriendDelete = async (e: React.MouseEvent, memberId: number) => {
    e.stopPropagation();

    try {
      await deleteFriend(memberId);
      triggerReloadChatrooms();
    } catch (error) {
      console.error(error);
    }
  };

  /* 친구 요청 취소 */
  const handleCancelFriendReq = async (
    e: React.MouseEvent,
    memberId: number
  ) => {
    e.stopPropagation();

    try {
      await cancelFriendRequest(memberId);
      triggerReloadChatrooms();
    } catch (error) {
      console.error(error);
    }
  };

  /* 친구 요청 수락 */
  const handleAcceptFriendReq = async (
    e: React.MouseEvent,
    memberId: number
  ) => {
    e.stopPropagation();

    try {
      await acceptFriendRequest(memberId);
      triggerReloadChatrooms();
    } catch (error) {
      console.error(error);
    }
  };

  /* 친구 요청 거절 */
  const handleRejectFriendReq = async (
    e: React.MouseEvent,
    memberId: number
  ) => {
    e.stopPropagation();

    try {
      await rejectFriendRequest(memberId);
      triggerReloadChatrooms();
    } catch (error) {
      console.error(error);
    }
  };

  if (chatrooms.length === 0) {
    return <NoData>{`생성된 채팅방이 없습니다.`}</NoData>;
  }

  return (
    <List onScroll={handleScroll}>
      {chatrooms?.map((room) => {
        return (
          <ChatRoomItem
            key={room.uuid}
            room={room}
            onChatRoom={(id) => {
              onChatRoom(id);
              dispatch(setChatEnterType(1)); // 대화방에서 채팅방 입장
            }}
            isMoreBoxOpen={isMoreBoxOpen}
            handleMoreBoxOpen={handleMoreBoxOpen}
            moreMenuItems={moreMenuItems}
            setIsMoreBoxOpen={setIsMoreBoxOpen}
          />
        );
      })}
    </List>
  );
};

export default ChatRoomList;

const List = styled.div``;

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular16};
  margin-top: 50%;
`;
