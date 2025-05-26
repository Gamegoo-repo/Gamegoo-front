"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { getBlockList } from "@/api/block/get";
import { BlockList } from "@/types/friend/blockList";
import BlockedBox from "@/components/mypage/blocked/BlockedBox";
import useMediaQueries from "@/hooks/useMediaQueries";

const MyBlockedPage = () => {
  const isMobile = useMediaQueries({ breakpoint: 700 });

  const [currentPage, setCurrentPage] = useState(1);
  const [myBlockedList, setMyBlockedList] = useState<BlockList[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const pageButtonCount = 5;

  useEffect(() => {
    const fetchGetMyBlocked = async () => {
      try {
        const response = await getBlockList(currentPage);
        if (response.data) {
          const { blockedMemberList, totalPage, totalElements } = response.data;
          setMyBlockedList(blockedMemberList);
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
          {isMobile && myBlockedList.length === 0 ? (
            <></>
          ) : (
            <Top>차단 목록</Top>
          )}

          {myBlockedList.length > 0 ? (
            <>
              <BlockedList>
                {myBlockedList.map((data) => (
                  <BlockedBox
                    key={data.memberId}
                    memberId={data.memberId}
                    profileImg={data.profileImg}
                    name={data.name}
                    blind={data.blind}
                  />
                ))}
              </BlockedList>
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
            </>
          ) : (
            <NoData>차단 친구가 없습니다.</NoData>
          )}
        </Blocked>
      </MyBlockedContent>
    </Wrapper>
  );
};

export default MyBlockedPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
  @media (max-width: 700px) {
    padding: 30px 20px;
  }
`;

const MyBlockedContent = styled.div`
  max-width: 1440px;
  width: 100%;
  @media (max-width: 700px) {
    padding: 0;
  }
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
  ${(props) => props.theme.fonts.bold25};
  padding-bottom: 13px;
  border-bottom: 1px solid ${theme.colors.gray300};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold18};
  }
`;

const BlockedList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
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
