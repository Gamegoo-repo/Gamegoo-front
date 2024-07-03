import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { Dispatch, useState } from 'react';
import MiniModal from './MiniModal';
import dayjs from 'dayjs';

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

    console.log(dayjs('2019-01-25').add(1, 'day').subtract(1, 'year').year(2009).toString())
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
                            </Left>
                            <Middle>
                                <UserName>{chat.userName}</UserName>
                                <Row>
                                    <p>{chat.msg}</p>
                                    <p>{chat.date}</p>
                                </Row>
                            </Middle>
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
  align-items: center;
  /* justify-content: space-between; */
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
    padding-left: 21px;
`;

const ProfileImage = styled(Image)`
    margin-right: 14px;
`;

const Middle = styled.div`
    margin-right: 12px;
    min-width: 284px;
`;
const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color:${theme.colors.black};  
`;

const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
`;

const Right = styled.div`

`;

