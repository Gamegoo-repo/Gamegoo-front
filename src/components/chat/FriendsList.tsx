import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import DeleteFriend from './DeleteFriend';
import { deleteFriend, getFriendsList, likeFriend, unLikeFriend } from '@/api/friends';
import { FriendListInterface } from '@/interface/friends';
import { getProfileBgColor } from '@/utils/profile';
import { socket } from '@/socket';
import { useSocketEvents } from '@/hooks/useSocketEvents';

interface FriendListProps {
    onChatRoom: (id: number) => void;
    activeTab: string;
}

const FriendsList = ({ onChatRoom, activeTab }: FriendListProps) => {
    const [friends, setFriends] = useState<FriendListInterface[]>([]);
    const [onlineFriends, setOnlineFriends] = useState<number[]>([]);

    const [deleteMenu, setDeleteMenu] = useState<{ x: number, y: number, friendId: number | null }>({ x: 0, y: 0, friendId: null });

    const favoriteFriends = friends.filter(friend => friend.liked);

    /* 친구 목록 가져오기 */
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

    }, [activeTab]);

    // useEffect(() => {
    //     // 소켓 연결 시도 중 에러 확인
    //     socket.on("connect_error", (err) => {
    //         console.error("Socket connection error:", err);
    //     });

    //     if (socket.connected) {
    //         console.log("Socket is already connected:", socket.id);
    //         // socket.emit("init-online-friend-list", friends);
    //     } else {
    //         socket.on("connect", () => {
    //             console.log("Socket connected:", socket.id);
    //             // socket.emit("init-online-friend-list", friends);
    //         });
    //     }

    //     socket.on("init-online-friend-list", (response) => {
    //         console.log("Received online friends list:", response);
    //         setOnlineFriends(response.data.onlineFriendMemberIdList);
    //     });

    //     return () => {
    //         socket.off("connect");
    //         socket.off("init-online-friend-list");
    //         socket.off("connect_error");
    //     };
    // }, [socket, friends]);

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
            console.error('친구 삭제 에러:', error);
        }
    };

    /* 친구 즐겨찾기 상태 변경 */
    const toggleFavorite = async (friendId: number, liked: boolean) => {
        try {
            if (liked) {
                await unLikeFriend(friendId);
            } else {
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
        <>
            <List>
                {favoriteFriends?.length > 0 &&
                    <FavoritesWrapper $length={favoriteFriends.length}>
                        <FavoritesTitle>
                            즐겨찾기
                        </FavoritesTitle>
                        {favoriteFriends.map(friend => {
                            const isOnline = onlineFriends.includes(friend.memberId);
                            return (
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
                                        <ImageWrapper $bgColor={getProfileBgColor(friend.memberProfileImg)}>
                                            <StyledImage
                                                src={`/assets/images/profile/profile${friend.memberProfileImg}.svg`}
                                                width={38}
                                                height={38}
                                                alt="사용자 프로필" />
                                        </ImageWrapper>
                                        <UserName>{friend.name}</UserName>
                                        {/* {friend.online === "on" &&
                                    <Online
                                        src="/assets/icons/online.svg"
                                        width={5}
                                        height={5}
                                        alt="온라인" />
                                } */}
                                        {isOnline && (
                                            <Online
                                                src="/assets/icons/online.svg"
                                                width={5}
                                                height={5}
                                                alt="온라인" />
                                        )}
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
                            return (
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
                                        <ImageWrapper $bgColor={getProfileBgColor(friend.memberProfileImg)}>
                                            <StyledImage
                                                src={`/assets/images/profile/profile${friend.memberProfileImg}.svg`}
                                                width={38}
                                                height={38}
                                                alt="사용자 프로필" />
                                        </ImageWrapper>
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
                            )
                        })}
                    </FriendsWrapper>
                }
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

const ImageWrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 47px;
    height: 47px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
`;

const StyledImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
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

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular16};
  margin-top:50%;
`;