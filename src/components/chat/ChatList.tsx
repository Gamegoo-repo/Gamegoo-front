import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatRoomDateFormatter } from '@/utils/custom';
import { Dispatch } from 'react';
import MoreBox from '../common/MoreBox';
import { MoreBoxMenuItems } from '@/interface/moreBox';

interface ChatListInterface {
    id: number;
    image: string;
    userName: string;
    msg: string;
    date: string;
}

interface ChatListProps {
    list: ChatListInterface[];
    onChatRoom: (id: number) => void;
    setIsMoreBoxOpen: Dispatch<React.SetStateAction<number | null>>;
    isMoreBoxOpen: number | null;
    onModalChange: (modalType: string) => void;
}

const ChatList = (props: ChatListProps) => {
    const { list, onChatRoom, setIsMoreBoxOpen, isMoreBoxOpen, onModalChange } = props;

    const handleMoreBoxOpen = (chatId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            setIsMoreBoxOpen(chatId);
        };
    };

    const handleFriendAdd = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (setIsMoreBoxOpen) {
            setIsMoreBoxOpen(null);
        }
        console.log('친구 추가')
    };

    const handleChangeModal = (e: React.MouseEvent, type: string) => {
        if (type) {
            e.stopPropagation();
        }

        onModalChange(type);
    };

    const menuItems: MoreBoxMenuItems[] = [
        { text: '채팅방 나가기', onClick: (e) => handleChangeModal(e, 'leave') },
        { text: '친구 추가', onClick: (e) => handleFriendAdd(e) },
        { text: '차단하기', onClick: (e) => handleChangeModal(e, 'block') },
        { text: '신고하기', onClick: (e) => handleChangeModal(e, 'report') },
        { text: '매너 평가', onClick: (e) => handleChangeModal(e, 'manner') },
        { text: '비매너 평가', onClick: (e) => handleChangeModal(e, 'badManner') },
    ];

    return (
        <>
            <List>
                {list.map(chat => {
                    return (
                        <UserContent
                            onClick={() =>
                                onChatRoom(chat.id)}
                            key={chat.id}>
                            {isMoreBoxOpen === chat.id &&
                                <MoreBox
                                    items={menuItems}
                                    top={10}
                                    left={208}
                                />
                            }
                            <Left>
                                <ProfileImage
                                    src={chat.image}
                                    width={45}
                                    height={45}
                                    alt="사용자 프로필" />
                                <Middle>
                                    <Row>
                                        <UserName>{chat.userName}</UserName>
                                        <Unread>10</Unread>
                                    </Row>
                                    <Row>
                                        <Msg>{chat.msg}</Msg>
                                        <Date>{setChatRoomDateFormatter(chat.date)}</Date>
                                    </Row>
                                </Middle>
                            </Left>
                            <Right
                                onClick={(e) => handleMoreBoxOpen(chat.id, e)}>
                                <MoreImage
                                    src="/assets/icons/three_dots_button.svg"
                                    width={3}
                                    height={15}
                                    alt="상세보기" />
                            </Right>
                        </UserContent>
                    )
                })}
            </List>

        </>
    )
};

export default ChatList;

const List = styled.div`
`;

const UserContent = styled.div`
  position: relative;
  display: flex;  
  justify-content: space-between;
  cursor: pointer;
  padding:18px 12px 18px 0;
  &:hover {
    background: ${theme.colors.gray500}; 
  }
`;
const Left = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 21px;
`;

const ProfileImage = styled(Image)`
    margin-right: 14px;
`;

const Middle = styled.div`
    min-width: 300px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color:${theme.colors.gray600};  
`;

const Unread = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:${theme.colors.white};  
    padding:0 5px;
    border-radius: 38px;
    background:${theme.colors.purple100};
`;

const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
`;

const Msg = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.gray600};  
`;

const Date = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:#C1C1C1;
    margin-right: 12px;
`;

const Right = styled.div`
    padding: 0 7px 0 12px;;
`;

const MoreImage = styled(Image)`
    cursor: pointer;
`;