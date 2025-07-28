import { useDispatch } from "react-redux";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { setChatEnterType } from "@/redux/slices/chatSlice";
import { theme } from "@/styles/theme";

import DeleteFriend from "./DeleteFriend";
import ProfileAvatar from "./ProfileAvatar";

import type { FriendList } from "@/types";

interface FriendItemProps {
  friend: FriendList;
  onChatRoom: (id: number) => void;
  onlineFriends: number[];
  onContextMenu: (event: React.MouseEvent, friendId: number) => void;
  onFavoriteToggle: (event: React.MouseEvent, friendId: number) => void;
  deleteMenu: { x: number; y: number; friendId: number | null };
  handleCloseDeleteMenu: () => void;
  handleDeleteFriend: () => void;
}

const FriendItem = (props: FriendItemProps) => {
  const {
    friend,
    onChatRoom,
    onlineFriends,
    onContextMenu,
    onFavoriteToggle,
    deleteMenu,
    handleCloseDeleteMenu,
    handleDeleteFriend,
  } = props;

  const dispatch = useDispatch();

  return (
    <UserContent
      onContextMenu={(event) => onContextMenu(event, friend.memberId)}
      onClick={() => {
        onChatRoom(friend.memberId);
        dispatch(setChatEnterType(0)); // 친구목록에서 채팅방 입장
      }}
    >
      {deleteMenu.friendId === friend.memberId && (
        <DeleteFriend
          x={deleteMenu.x}
          y={deleteMenu.y}
          onClose={handleCloseDeleteMenu}
          onDelete={handleDeleteFriend}
        />
      )}
      <Left>
        <ProfileAvatar
          profileImgNum={friend.profileImg}
          isBlind={friend.blind}
        />
        <UserName>{friend.name}</UserName>
        {onlineFriends.includes(friend.memberId) && (
          <Icon
            backgroundUrl="/assets/icons/online.svg"
            width={5}
            height={5}
            style={{
              position: "absolute",
              top: "19%",
              right: "-10px",
            }}
          />
        )}
      </Left>
      {!friend.blind && (
        <button onClick={(e) => onFavoriteToggle(e, friend.memberId)}>
          <Icon
            backgroundUrl={
              friend.liked
                ? "/assets/icons/favorites.svg"
                : "/assets/icons/non_favorites.svg"
            }
            width={36}
            height={36}
          />
        </button>
      )}
    </UserContent>
  );
};

export default FriendItem;

const UserContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 5px 18px 5px 16px;
  &:hover {
    background: ${theme.colors.gray100};
  }
`;

const Left = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ImageWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 45px;
  height: 45px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const StyledImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const UserName = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
`;
