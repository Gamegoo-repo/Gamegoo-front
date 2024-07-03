import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import MiniModal from './MiniModal';
import { setChatDateFormatter } from '@/utils/custom';

interface ChatListInterface {
    id: number;
    image: string;
    userName: string;
    msg: string;
    date: string;
}

interface ChatListProps {
    list: ChatListInterface[];
}

const ChatList = (props: ChatListProps) => {
    const { list } = props;

    return (
        <>
            <List>
                {list.map(chat => {
                    return (
                        <UserContent
                            key={chat.id}>
                            <Left>
                                <ProfileImage
                                    src={chat.image}
                                    width={45}
                                    height={45}
                                    alt="사용자 프로필" />
                                <Middle>
                                    <UserName>{chat.userName}</UserName>
                                    <Row>
                                        <Msg>{chat.msg}</Msg>
                                        <Date>{setChatDateFormatter(chat.date)}</Date>
                                    </Row>
                                </Middle>
                            </Left>
                            <Right>
                                <Image
                                    src="/assets/icons/three_dots_button.svg"
                                    width={3}
                                    height={15}
                                    alt="신고하기 버튼" />
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
    &.border {
        border-bottom: 1px solid ${theme.colors.gray400};
    }
    &.none{
        border-bottom:none;
    }
`;


const UserContent = styled.div`
  display: flex;  
  justify-content: space-between;
  cursor: pointer;
  padding:18px 19px 18px 0;
  &:last-child {
    padding: 5px 19px 11px 0;
    }
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

const Middle = styled.div``;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color:${theme.colors.gray600};  
`;

const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    min-width: 284px;
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

