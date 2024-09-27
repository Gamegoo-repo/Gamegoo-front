import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeChat, openChatRoom, setChatRoomUuid } from "@/redux/slices/chatSlice";
import Header from "./Header";
import SearchBar from "./SearchBar";
import FriendList from "./FriendList";
import ChatRoomList from "./ChatRoomList";
import { RootState } from "@/redux/store";
import ChatLayout from "./ChatLayout";
import { FriendListInterface } from "@/interface/friends";
import { getFriendsList, likeFriend, unLikeFriend } from "@/api/friends";

const Layout = () => {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(0);
    const [friends, setFriends] = useState<FriendListInterface[]>([]);
    const [favoriteFriends, setFavoriteFriends] = useState<FriendListInterface[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const tabs = ['친구 목록', '대화방'];

    const isChatRoomOpen = useSelector((state: RootState) => state.chat.isChatRoomOpen);
    const isChatUuid = useSelector((state: RootState) => state.chat.isChatRoomUuid);

    /* 채팅방 입장 */
    const handleGoToChatRoom = (id: string | number) => {
        console.log('id:', id)
        dispatch(setChatRoomUuid(id));
        dispatch(openChatRoom());
        // TODO
        // if (typeof id === 'string') {
        // setChatRoomUuid(id);
        // }
    };

    /* 친구 목록 가져오기 */
    const handleFetchFriendsList = async () => {
        try {
            const data = await getFriendsList();
            const friendsList = data?.result?.friendInfoDTOList;

            if (Array.isArray(friendsList)) {
                setFriends(friendsList);
                const likedFriends = friendsList.filter(friend => friend.isLiked);
                setFavoriteFriends(likedFriends);
            } else {
                setFriends([]);
                setFavoriteFriends([]);
            }
        } catch (error) {
            console.error(error);
            setFriends([]);
            setFavoriteFriends([]);
        }
    };

    useEffect(() => {
        const likedFriends = friends.filter(friend => friend.isLiked);
        setFavoriteFriends(likedFriends);
    }, [friends]);

    /* 검색 중이 아닐 때만 전체 목록을 가져오기. */
    useEffect(() => {
        if (!isSearching) {
            handleFetchFriendsList();
        }
    }, [activeTab, isSearching]);

    /* 친구 검색 */
    const handleSearch = (searchResults: FriendListInterface[] | null) => {
        if (searchResults === null) {
            // 검색어 결과 없을 경우 전체 친구 목록 보여주기
            setIsSearching(false);
            handleFetchFriendsList();
        } else {
            // 검색 결과 업데이트
            setIsSearching(true);
            setFriends(searchResults);

            const likedFriends = searchResults.filter(friend => friend.isLiked);
            setFavoriteFriends(likedFriends);
        }
    };

    /* 즐겨찾기 상태 변경 */
    const handleFavoriteToggle = async (event: React.MouseEvent, friendId: number) => {
        event.stopPropagation();

        // friends 배열과 검색된 친구 목록에서 해당 친구 찾기
        const friend = friends.find((f) => f.memberId === friendId);
        if (friend) {
            const newLikedStatus = !friend.isLiked;

            // friends 상태 업데이트
            setFriends((prevFriends) =>
                prevFriends.map((f) =>
                    f.memberId === friendId ? { ...f, isLiked: newLikedStatus } : f
                )
            );

            // favoriteFriends 상태 업데이트 
            setFavoriteFriends((prevFavorites) =>
                newLikedStatus
                    ? [...prevFavorites, { ...friend, isLiked: newLikedStatus }]
                    : prevFavorites.filter((f) => f.memberId !== friendId)
            );

            try {
                if (newLikedStatus) {
                    await likeFriend(friendId);
                } else {
                    await unLikeFriend(friendId);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <>
            {isChatRoomOpen && isChatUuid !== null ? (
                <ChatLayout
                    apiType={activeTab}
                />
            ) : (
                <Overlay>
                    <Wrapper>
                        <CloseButton>
                            <CloseImage
                                onClick={() => dispatch(closeChat())}
                                src='/assets/icons/close.svg'
                                width={11}
                                height={11}
                                alt='닫기' />
                        </CloseButton>
                        <Header
                            title="메신저"
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabClick={setActiveTab}
                        />
                        {activeTab === 0 && <SearchBar onSearch={handleSearch} />}
                        <ChatMain className={activeTab === 0 ? 'friend' : 'chat'}>
                            <Content className={activeTab === 0 ? 'friend' : 'chat'}>
                                {activeTab === 0 ?
                                    <FriendList
                                        onChatRoom={handleGoToChatRoom}
                                        friends={friends}
                                        favoriteFriends={favoriteFriends}
                                        onFavoriteToggle={handleFavoriteToggle}
                                        handleFetchFriendsList={handleFetchFriendsList} 
                                        isSearching={isSearching}
                                    />
                                    :
                                    <ChatRoomList
                                        onChatRoom={handleGoToChatRoom}
                                        activeTab={activeTab}
                                    />}
                            </Content>
                        </ChatMain>
                    </Wrapper>
                </Overlay>
            )}
        </>
    )
};

export default Layout;

const Overlay = styled.div`
    position:fixed;
    top: 50%;
    right: 8%;
    transform: translate(0, -50%);
    z-index: 1;
`;

const Wrapper = styled.div`
    background: ${theme.colors.white};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    width: 418px;
    box-shadow: 0 4px 46.7px 0 #0000001A;
`;

const CloseButton = styled.p`
    display:flex;
    margin-bottom:1px;
    padding:12px 13px 0 0;
`;

const CloseImage = styled(Image)`
    margin-left:auto;
    cursor: pointer;
`;

const ChatMain = styled.div`
    border-radius: 0 0 20px 20px;
    background:${theme.colors.white};
    &.friend{
        box-shadow: none;
        padding-right: 6px;
    }
    &.chat{
        box-shadow: inset 0 0 4.7px 0 #00000026;
    }
`;

const Content = styled.main`
    &.friend{
        height: 508px; 
    }
    &.chat{
        height: 590px; 
    }

    overflow-y: auto; 
    &::-webkit-scrollbar {
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 66px;
        background: ${theme.colors.gray300};
    }
    &::-webkit-scrollbar-track {
        border-radius: 66px;
        background: transparent;
    }
`;
