"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import AlertBox from "@/components/mypage/alert/AlertBox";
import Image from "next/image";
import { EX_BLOCKED } from "@/data/mypage";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import BlockedBox from "@/components/mypage/blocked/BlockedBox";
import ChatButton from "@/components/common/ChatButton";

const MyBlockedPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const pageButtonCount = 5;
  const [currentItems, setCurrentItems] = useState(
    EX_BLOCKED.slice(0, itemsPerPage)
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(EX_BLOCKED.slice(startIndex, endIndex));
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  return (
    <Wrapper>
      <MyBlockedContent>
        <Blocked>
          <Top>차단목록</Top>
          <BlockedList>
            {currentItems.map((data, index) => (
              <BlockedBox key={data.id} name={data.name} />
            ))}
          </BlockedList>
          {/* <Pagination
            currentPage={currentPage}
            totalItems={EX_BLOCKED.length}
            itemsPerPage={itemsPerPage}
            pageButtonCount={pageButtonCount}
            onPageChange={handlePageChange}
          /> */}
        </Blocked>
      </MyBlockedContent>
      <Footer>
          <ChatBoxContent>
            <ChatButton count={3} />
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

const Footer = styled.footer`
  display: flex;
  margin-bottom: 78px;
`;

const ChatBoxContent = styled.div`
  margin-left: auto;
`;