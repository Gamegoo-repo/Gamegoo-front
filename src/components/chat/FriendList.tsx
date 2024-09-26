import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { useEffect, useState } from 'react';
import { FriendListInterface } from '@/interface/friends';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { deleteFriend, getFriendsList, likeFriend, unLikeFriend } from '@/api/friends';
import FriendItem from './FriendItem';

interface FriendListProps {
    onChatRoom: (id: number) => void;
    activeTab: number;
}

const FriendList = (props: FriendListProps) => {
    const { onChatRoom, activeTab } = props;

    const [friends, setFriends] = useState<FriendListInterface[]>([]);
    const [deleteMenu, setDeleteMenu] = useState<{ x: number, y: number, friendId: number | null }>({ x: 0, y: 0, friendId: null });

    const favoriteFriends = friends?.filter(friend => friend.isLiked);

    const onlineFriends = useSelector((state: RootState) => state.chat.onlineFriends);

    /* 친구 목록 가져오기 */
    const handleFetchFriendsList = async () => {
        try {
            const data = await getFriendsList();
            if (Array.isArray(data.result.friendInfoDTOList)) {
                setFriends(data.result.friendInfoDTOList);
            } else {
                setFriends([]);
            }
        } catch (error) {
            console.error(error);
            setFriends([]);
        }
    };

    useEffect(() => {
        handleFetchFriendsList();
    }, [activeTab]);

    /* 즐겨찾기 상태 변경 */
    const handleFavoriteToggle = async (event: React.MouseEvent, friendId: number) => {
        event.stopPropagation();

        const friend = friends.find((f) => f.memberId === friendId);
        if (friend) {
            const newLikedStatus = !friend.isLiked;
            setFriends((prevFriends) =>
                prevFriends.map((f) =>
                    f.memberId === friendId ? { ...f, isLiked: newLikedStatus } : f
                )
            );

            try {
                if (newLikedStatus) {
                    await likeFriend(friendId);
                } else {
                    await unLikeFriend(friendId);
                }
                // 친구 목록 새로 고침
                await handleFetchFriendsList();
            } catch (error) {
                console.error(error);
            }
        }
    };

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

    if (friends.length === 0) {
        return <NoData>{`새로운 친구를 추가하고\n함께 게임을 즐겨보세요 !`}</NoData>;
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
                                onFavoriteToggle={handleFavoriteToggle}
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
                                onFavoriteToggle={handleFavoriteToggle}
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