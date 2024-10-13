import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { useEffect, useState } from 'react';
import { FriendListInterface } from '@/interface/friends';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { deleteFriend } from '@/api/friends';
import FriendItem from './FriendItem';

interface FriendListProps {
    onChatRoom: (id: number) => void;
    friends: FriendListInterface[];
    favoriteFriends: FriendListInterface[];
    onFavoriteToggle: (e: React.MouseEvent, friendId: number) => void;
    handleFetchFriendsList: () => void;
    isSearching: boolean;
}

const FriendList = (props: FriendListProps) => {
    const {
        onChatRoom,
        friends,
        favoriteFriends,
        onFavoriteToggle,
        isSearching,
        handleFetchFriendsList
    } = props;

    const [deleteMenu, setDeleteMenu] = useState<{ x: number, y: number, friendId: number | null }>({ x: 0, y: 0, friendId: null });

    const onlineFriends = useSelector((state: RootState) => state.chat.onlineFriends);

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
                await deleteFriend(friendId);
                await handleFetchFriendsList();
                await handleCloseDeletetMenu();
            }
        } catch (error) {
            console.error(error);
        }
    };

    /* 브라우저 너비 변경 시 삭제하기 버튼 닫기 */
    useEffect(() => {
        window.addEventListener('resize', handleCloseDeletetMenu);

        return () => {
            window.removeEventListener('resize', handleCloseDeletetMenu);
        };
    }, []);

    /* 전체 친구 목록이 없을 때 */
    if (friends.length === 0 && !isSearching) {
        return <NoData>{`새로운 친구를 추가하고\n함께 게임을 즐겨보세요 !`}</NoData>;
    }

    /* 검색 결과가 없을 때 */
    if (friends.length === 0 && isSearching) {
        return <NoData>{`해당하는 친구가 없습니다.`}</NoData>;
    }

    return (
        <List>
            {favoriteFriends?.length > 0 &&
                <FavoritesWrapper $length={favoriteFriends.length}>
                    <FavoritesTitle>
                        즐겨찾기
                    </FavoritesTitle>
                    {favoriteFriends.map(friend => {
                        const isOnline = onlineFriends?.includes(friend.memberId);
                        return (
                            <FriendItem
                                key={friend.memberId}
                                friend={friend}
                                onChatRoom={onChatRoom}
                                isOnline={isOnline}
                                onContextMenu={handleContextMenu}
                                onFavoriteToggle={onFavoriteToggle}
                                deleteMenu={deleteMenu}
                                handleCloseDeleteMenu={handleCloseDeletetMenu}
                                handleDeleteFriend={handleDeleteFriend}
                            />
                        )
                    })}
                </FavoritesWrapper>
            }
            {friends.length > 0 &&
                <FriendsWrapper $length={favoriteFriends.length}>
                    <FriendsTitle>
                        친구 {friends.length}
                    </FriendsTitle>
                    {friends.map(friend => {
                        const isOnline = onlineFriends?.includes(friend.memberId);
                        return (
                            <FriendItem
                                key={friend.memberId}
                                friend={friend}
                                onChatRoom={onChatRoom}
                                isOnline={isOnline}
                                onContextMenu={handleContextMenu}
                                onFavoriteToggle={onFavoriteToggle}
                                deleteMenu={deleteMenu}
                                handleCloseDeleteMenu={handleCloseDeletetMenu}
                                handleDeleteFriend={handleDeleteFriend}
                            />
                        )
                    })}
                </FriendsWrapper>
            }
        </List>
    )
};

export default FriendList;

const List = styled.div`
`;

const FavoritesWrapper = styled.div<{ $length: number }>`
    padding: ${({ $length }) => ($length > 0 ? '6px 0 11px 0' : 'none')};
`;

const FriendsWrapper = styled.div<{ $length: number }>`
    border-top: ${({ $length }) => ($length > 0 ? `1px solid ${theme.colors.gray400}` : 'unset')};
    padding-top: 6px;
`;

const FavoritesTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
    padding: 0 16px 11px 18px;
`;

const FriendsTitle = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
    padding: 0 16px 11px 18px;
`;

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular16};
  margin-top:50%;
`;