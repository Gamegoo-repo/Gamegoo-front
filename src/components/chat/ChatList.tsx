import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatRoomDateFormatter } from '@/utils/custom';
import { Dispatch } from 'react';
import MiniModal from './MiniModal';

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

    const handleMoreBoxOpen = (chatId: number) => {
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            setIsMoreBoxOpen(chatId);
        };
    };

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
                                <MiniModal
                                    type="chatList"
                                    onChangeModal={onModalChange}
                                    setIsMoreBoxOpen={setIsMoreBoxOpen} />}
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
                            <Right>
                                <MoreImage
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoreBoxOpen(chat.id);
                                    }}
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
  padding:18px 19px 18px 0;
  &:hover {
    position: unset;
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
    min-width: 304px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color:${theme.colors.gray600};  
`;

const Unread = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:${theme.colors.white};  
    margin-right: 12px;
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

const Right = styled.div``;

const MoreImage = styled(Image)`
    cursor: pointer;
`;