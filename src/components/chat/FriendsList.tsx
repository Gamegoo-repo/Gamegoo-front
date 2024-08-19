import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DeleteFriend from './DeleteFriend';
import { getFriendsList, likeFriend, unLikeFriend } from '@/api/friends';

interface FriendListInterface {
    memberId: number;
    name: string;
    memberProfileImg: number;
    liked: boolean;
}

interface FriendListProps {
    list: FriendListInterface[];
    onChatRoom: (id: number) => void;
}

const FriendsList = ({ list, onChatRoom }: FriendListProps) => {
    const [friends, setFriends] = useState<FriendListInterface[]>([]);

    const [deleteMenu, setDeleteMenu] = useState<{ x: number, y: number, friendId: number | null }>({ x: 0, y: 0, friendId: null });

    const favoriteFriends = friends.filter(friend => friend.liked);
    const nonFavoriteFriends = friends.filter(friend => !friend.liked);

    useEffect(() => {
        const handleFetchFriendsList = async () => {
            try {
                const data = await getFriendsList();
                setFriends(data.result);
            } catch (error) {
                console.error("에러:", error);
            }
        }

        handleFetchFriendsList();
    }, [])

    const handleContextMenu = (event: React.MouseEvent, friendId: number) => {
        event.preventDefault();
        event.stopPropagation();

        const x = event.pageX;
        const y = event.pageY;
        setDeleteMenu({ x: x, y: y, friendId });
    };

    const handleCloseDeletetMenu = () => {
        setDeleteMenu({ x: 0, y: 0, friendId: null });
    };

    const handleDeleteFriend = () => {
        const { friendId } = deleteMenu;
        if (friendId) {
            console.log(`${friendId}삭제`)
            // setFriends(friends.filter((friend) => friend.id !== friendId));
            handleCloseDeletetMenu();
        }
    };

    const toggleFavorite = async (friendId: number, liked: boolean) => {
        try {
            if (liked) {
                await unLikeFriend(friendId);
            } else {
                // 즐겨찾기 추가 API 호출
                await likeFriend(friendId);
            }
        } catch (error) {
            console.error('즐겨찾기 상태 변경 중 에러:', error);
        }
    };

    const handleFavoriteToggle = (event: React.MouseEvent, friendId: number) => {
        event.stopPropagation();

        const updatedFriends = friends.map(friend => {
            if (friend.memberId === friendId) {
                const newLikedStatus = !friend.liked;
                toggleFavorite(friendId, friend.liked);
                return { ...friend, liked: newLikedStatus };
            }
            return friend;
        });

        setFriends(updatedFriends);
        // setFriends(friends.map(friend =>
        //     friend.memberId === friendId ? { ...friend, favorites: friend.liked ? 0 : 1 } : friend
        // ));
    };

    /* 브라우저 너비 변경 시 삭제하기 버튼 닫기 */
    useEffect(() => {
        window.addEventListener('resize', handleCloseDeletetMenu);

        return () => {
            window.removeEventListener('resize', handleCloseDeletetMenu);
        };
    }, []);

    if (friends.length === 0) {
        return null;
    }

    return (
        <>
            <List>
                <FavoritesWrapper $length={favoriteFriends.length}>
                    {favoriteFriends?.length > 0 &&
                        <FavoritesTitle>
                            즐겨찾기
                        </FavoritesTitle>
                    }
                    {favoriteFriends.map(friend => (
                        <UserContent
                            onContextMenu={(e) => handleContextMenu(e, friend.memberId)}
                            onClick={() =>
                                onChatRoom(friend.memberId)}
                            key={friend.memberId}
                        >
                            {deleteMenu.friendId === friend.memberId && (
                                <>
                                    <DeleteFriend
                                        x={deleteMenu.x}
                                        y={deleteMenu.y}
                                        onClose={handleCloseDeletetMenu}
                                        onDelete={handleDeleteFriend}
                                    />
                                </>
                            )}
                            <Left>
                                <Image
                                    src={`/assets/images/profile/profile${friend.memberProfileImg}.svg`}
                                    width={40.79}
                                    height={40.79}
                                    alt="사용자 프로필" />
                                <UserName>{friend.name}</UserName>
                                {/* {friend.online === "on" &&
                                    <Online
                                        src="/assets/icons/online.svg"
                                        width={5}
                                        height={5}
                                        alt="온라인" />
                                } */}
                            </Left>
                            <Image
                                onClick={(e) => handleFavoriteToggle(e, friend.memberId)}
                                src={
                                    friend.liked
                                        ? "/assets/icons/favorites.svg"
                                        : "/assets/icons/nonFavorites.svg"
                                }
                                width={15}
                                height={15}
                                alt="즐겨찾기 버튼"
                            />
                        </UserContent>
                    ))}
                </FavoritesWrapper>
                <FriendsWrapper $length={favoriteFriends.length}>
                    <FriendsTitle>
                        친구 {nonFavoriteFriends.length}
                    </FriendsTitle>
                    {nonFavoriteFriends.map(friend => (
                        <UserContent
                            onContextMenu={(event) => handleContextMenu(event, friend.memberId)}
                            onClick={() => onChatRoom(friend.memberId)}
                            key={friend.memberId}
                        >
                            {deleteMenu.friendId === friend.memberId && (
                                <DeleteFriend
                                    x={deleteMenu.x}
                                    y={deleteMenu.y}
                                    onClose={handleCloseDeletetMenu}
                                    onDelete={handleDeleteFriend}
                                />
                            )}
                            <Left>
                                <Image
                                    src={`/assets/images/profile/profile${friend.memberProfileImg}.svg`}
                                    width={40.79}
                                    height={40.79}
                                    alt="사용자 프로필" />
                                <UserName>{friend.name}</UserName>
                                {/* {friend.online === "on" &&
                                    <Online
                                        src="/assets/icons/online.svg"
                                        width={5}
                                        height={5}
                                        alt="온라인" />
                                } */}
                            </Left>
                            <Image
                                onClick={(e) => handleFavoriteToggle(e, friend.memberId)}
                                src={
                                    friend.liked
                                        ? "/assets/icons/favorites.svg"
                                        : "/assets/icons/nonFavorites.svg"
                                }
                                width={15}
                                height={15}
                                alt="즐겨찾기 버튼"
                            />
                        </UserContent>
                    ))}
                </FriendsWrapper>
            </List>
        </>
    );
};

export default FriendsList;

const List = styled.div`
`;

const FavoritesWrapper = styled.div<{ $length: number }>`
    padding: ${({ $length }) => ($length > 0 ? '6px 0 11px 0' : 'none')};
`;

const FriendsWrapper = styled.div<{ $length: number }>`
    border-top: ${({ $length }) => ($length > 0 ? `1px solid ${theme.colors.gray400}` : 'unset')};
    padding: 6px 0 11px;
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

const UserContent = styled.div`
    position: relative;
    display: flex;  
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 5px 18px 5px 16px;
    &:hover {
        background: ${theme.colors.gray500}; 
    }
`;

const Left = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: ${theme.colors.gray600};  
`;

const Online = styled(Image)`
    position: absolute;
    top: 19%;
    right: -4%;
`;