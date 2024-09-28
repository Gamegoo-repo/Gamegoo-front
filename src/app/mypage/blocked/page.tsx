"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import ChatButton from "@/components/common/ChatButton";
import BlockedBox, {
  BlockedBoxProps,
} from "@/components/mypage/blocked/BlockedBox";
import { getMyBlocked } from "@/api/user";

const MyBlockedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [myBlockedList, setMyBlockedList] = useState<BlockedBoxProps[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const pageButtonCount = 5;

  useEffect(() => {
    const fetchGetMyBlocked = async () => {
      try {
        const response = await getMyBlocked(currentPage);
        if (response.isSuccess) {
          const { blockedMemberDTOList, totalPage, totalElements } =
            response.result;
          setMyBlockedList(blockedMemberDTOList);
          setTotalPages(totalPage);
          setTotalItems(totalElements);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGetMyBlocked();
  }, [currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Wrapper>
      <MyBlockedContent>
        <Blocked>
          <Top>차단목록</Top>
          {myBlockedList.length > 0 ? (
            <BlockedList>
              {myBlockedList.map((data) => (
                <BlockedBox
                  key={data.memberId}
                  memberId={data.memberId}
                  profileImg={data.profileImg}
                  email={data.email}
                  name={data.name}
                  isBlind={data.isBlind}
                />
              ))}
            </BlockedList>
          ) : (
            <NoData>차단 친구가 없습니다.</NoData>
          )}
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            totalPage={totalPages}
            itemsPerPage={itemsPerPage}
            pageButtonCount={pageButtonCount}
            hasMoreItems={currentPage < totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageClick={handlePageClick}
          />
        </Blocked>
      </MyBlockedContent>
      <Footer>
        <ChatBoxContent>
<<<<<<< HEAD
          <ChatButton count={3} />
=======
          <ChatButton />
>>>>>>> 390f982122858b5bf880b20041ce3d528d1a1ef3
        </ChatBoxContent>
      </Footer>
    </Wrapper>
  );
};

export default MyBlockedPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyBlockedContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Blocked = styled.header`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 32px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
  margin-bottom: 44px;
`;

const BlockedList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  border-top: 1px solid ${theme.colors.gray300};
`;

const NoData = styled.div`
  width: 100%;
  height: 100%;
  min-height: 686px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${theme.colors.gray600};
  ${theme.fonts.regular16}
`;

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;
