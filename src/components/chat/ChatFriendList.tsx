import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { theme } from "@/styles/theme";
import { friendApi } from "@/utils/api";

import FriendItem from "./FriendItem";

import type { RootState } from "@/redux/store";
import type { FriendList } from "@/types";

interface FriendListProps {
  onChatRoom: (id: number) => void;
  friends: FriendList[];
  favoriteFriends: FriendList[];
  onFavoriteToggle: (e: React.MouseEvent, friendId: number) => void;
  handleFetchFriendsList: () => void;
  isSearching: boolean;
}

const ChatFriendList = (props: FriendListProps) => {
  const {
    onChatRoom,
    friends,
    favoriteFriends,
    onFavoriteToggle,
    isSearching,
    handleFetchFriendsList,
  } = props;

  const [deleteMenu, setDeleteMenu] = useState<{
    x: number;
    y: number;
    friendId: number | null;
  }>({ x: 0, y: 0, friendId: null });

  const onlineFriends = useSelector(
    (state: RootState) => state.chat.onlineFriends
  );

  /* 삭제 하기 버튼 열기 */
  const handleContextMenu = (event: React.MouseEvent, friendId: number) => {
    event.preventDefault();
    event.stopPropagation();

    const x = event.pageX;
    const y = event.pageY;
    setDeleteMenu({ x: x, y: y, friendId });
  };

  /* 삭제하기 버튼 닫기 */
  const handleCloseDeletetMenu = () => {
    setDeleteMenu({ x: 0, y: 0, friendId: null });
  };

  /* 친구 삭제 */
  const handleDeleteFriend = async () => {
    const { friendId } = deleteMenu;

    try {
      if (friendId) {
        await friendApi.deleteFriend({ memberId: friendId });
        await handleFetchFriendsList();
        await handleCloseDeletetMenu();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* 브라우저 너비 변경 시 삭제하기 버튼 닫기 */
  useEffect(() => {
    window.addEventListener("resize", handleCloseDeletetMenu);

    return () => {
      window.removeEventListener("resize", handleCloseDeletetMenu);
    };
  }, []);

  /* 전체 친구 목록이 없을 때 */
  if (friends.length === 0 && !isSearching) {
    return (
      <NoData>{`새로운 친구를 추가하고\n함께 게임을 즐겨보세요 !`}</NoData>
    );
  }

  /* 검색 결과가 없을 때 */
  if (friends.length === 0 && isSearching) {
    return <NoData>{`해당하는 친구가 없습니다.`}</NoData>;
  }

  return (
    <List>
      {favoriteFriends?.length > 0 && (
        <FavoritesWrapper $length={favoriteFriends.length}>
          <FavoritesTitle>즐겨 찾기</FavoritesTitle>
          {favoriteFriends.map((friend) => {
            return (
              <FriendItem
                key={friend.memberId}
                friend={friend}
                onChatRoom={onChatRoom}
                onlineFriends={onlineFriends}
                onContextMenu={handleContextMenu}
                onFavoriteToggle={onFavoriteToggle}
                deleteMenu={deleteMenu}
                handleCloseDeleteMenu={handleCloseDeletetMenu}
                handleDeleteFriend={handleDeleteFriend}
              />
            );
          })}
        </FavoritesWrapper>
      )}
      {friends.length > 0 && (
        <FriendsWrapper $length={favoriteFriends.length}>
          <FriendsTitle>친구 {friends.length}</FriendsTitle>
          {friends.map((friend) => {
            return (
              <FriendItem
                key={friend.memberId}
                friend={friend}
                onChatRoom={onChatRoom}
                onlineFriends={onlineFriends}
                onContextMenu={handleContextMenu}
                onFavoriteToggle={onFavoriteToggle}
                deleteMenu={deleteMenu}
                handleCloseDeleteMenu={handleCloseDeletetMenu}
                handleDeleteFriend={handleDeleteFriend}
              />
            );
          })}
        </FriendsWrapper>
      )}
    </List>
  );
};

export default ChatFriendList;

const List = styled.div``;

const FavoritesWrapper = styled.div<{ $length: number }>`
  padding: ${({ $length }) => ($length > 0 ? "6px 0 11px 0" : "none")};
`;

const FriendsWrapper = styled.div<{ $length: number }>`
  border-top: ${({ $length }) =>
    $length > 0 ? `1px solid ${theme.colors.gray200}` : "unset"};
  border-bottom: ${({ $length }) =>
    $length > 0 ? `1px solid ${theme.colors.gray200}` : "unset"};
  padding: 6px 0 11px 0;
`;

const FavoritesTitle = styled.p`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray500};
  padding: 6px 18px 7px 18px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const FriendsTitle = styled.p`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray500};
  padding: 6px 18px 7px 18px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: left;
  }
`;

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray700};
  ${theme.fonts.regular16};
  margin-top: 50%;
`;
