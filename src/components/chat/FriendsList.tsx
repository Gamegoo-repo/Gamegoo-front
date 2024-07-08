import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { Dispatch, useState } from 'react';

interface FriendListInterface {
    id: number;
    image: string;
    userName: string;
    online: string;
    favorites: number;
}

interface FriendListProps {
    list: FriendListInterface[];
    isFavorites: boolean;
    setIsDeleteBox?: Dispatch<React.SetStateAction<boolean>>;
    onChatRoom: (id: number) => void;
}

const FriendsList = (props: FriendListProps) => {
    const { list, isFavorites, setIsDeleteBox, onChatRoom } = props;
    const [friends, setFriends] = useState(list);

    const toggleFavorite = (id: number) => {
        setFriends(prevFriends =>
            prevFriends.map(friend =>
                friend.id === id
                    ? { ...friend, favorites: friend.favorites === 1 ? 0 : 1 }
                    : friend
            )
        );
    };

    if (friends.length === 0) {
        return null;
    }

    return (
        <>
            <List className={isFavorites ? 'border' : 'none'}>
                <Title className={isFavorites ? 'none' : 'padding'}>
                    {isFavorites ? '즐겨찾기' : `친구 ${friends.length}`}
                </Title>
                {friends.map(friend => (
                    <UserContent
                        onClick={() => onChatRoom(friend.id)}
                        key={friend.id}>
                        <Left>
                            <Image
                                src={friend.image}
                                width={40.79}
                                height={40.79}
                                alt="사용자 프로필" />
                            <UserName>{friend.userName}</UserName>
                            {friend.online === "on" &&
                                <Online
                                    src="/assets/icons/online.svg"
                                    width={5}
                                    height={5}
                                    alt="온라인" />
                            }
                        </Left>
                        <Image
                            onClick={() => toggleFavorite(friend.id)}
                            src={
                                friend.favorites === 1
                                    ? "assets/icons/favorites.svg"
                                    : "assets/icons/nonFavorites.svg"
                            }
                            width={15}
                            height={15}
                            alt="즐겨찾기 버튼"
                        />
                    </UserContent>
                ))}
            </List>
        </>
    );
};

export default FriendsList;

const List = styled.div`
    &.border {
        border-bottom: 1px solid ${theme.colors.gray400};
    }
    &.none {
        border-bottom: none;
    }
`;

const Title = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color: ${theme.colors.gray200}; 
    &.padding{
        padding: 11px 16px 11px 18px;
    }
    &.none {
        padding: 0 16px 11px 18px;
    }
`;

const UserContent = styled.div`
    display: flex;  
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 5px 16px 5px 0;
    &:last-child {
        padding: 5px 16px 11px 0;
    }
    &:hover {
        background: ${theme.colors.gray500}; 
    }
`;

const Left = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
    padding-left: 18px;
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
