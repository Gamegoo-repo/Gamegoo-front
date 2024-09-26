import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from "next/image";
import { FriendListInterface } from '@/interface/friends';
import DeleteFriend from './DeleteFriend';
import { getProfileBgColor } from '@/utils/profile';

interface FriendItemProps {
    friend: FriendListInterface;
    onChatRoom: (id: number) => void;
    isOnline: boolean;
    onContextMenu: (event: React.MouseEvent, friendId: number) => void;
    onFavoriteToggle: (event: React.MouseEvent, friendId: number) => void;
    deleteMenu: { x: number, y: number, friendId: number | null };
    handleCloseDeleteMenu: () => void;
    handleDeleteFriend: () => void;
}

const FriendItem = (props: FriendItemProps) => {
    const {
        friend,
        onChatRoom,
        isOnline,
        onContextMenu,
        onFavoriteToggle,
        deleteMenu,
        handleCloseDeleteMenu,
        handleDeleteFriend
    } = props;

    return (
        <UserContent
            onContextMenu={(event) => onContextMenu(event, friend.memberId)}
            onClick={() => onChatRoom(friend.memberId)}
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
                <ImageWrapper $bgColor={getProfileBgColor(friend.memberProfileImg)}>
                    <StyledImage
                        src={`/assets/images/profile/profile${friend.memberProfileImg}.svg`}
                        width={38}
                        height={38}
                        alt="사용자 프로필"
                    />
                </ImageWrapper>
                <UserName>{friend.name}</UserName>
                {isOnline && (
                    <Online
                        src="/assets/icons/online.svg"
                        width={5}
                        height={5}
                        alt="온라인"
                    />
                )}
            </Left>
            <Image
                onClick={(e) => onFavoriteToggle(e, friend.memberId)}
                src={
                    friend.isLiked
                        ? "/assets/icons/favorites.svg"
                        : "/assets/icons/nonFavorites.svg"
                }
                width={15}
                height={15}
                alt="즐겨찾기 버튼"
            />
        </UserContent>
    )
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