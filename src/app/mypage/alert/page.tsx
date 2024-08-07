"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import AlertBox from "@/components/mypage/alert/AlertBox";
import Image from "next/image";
import { EX_ALARM as initialEX_ALARM } from "@/data/mypage";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";

const MyAlertPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [EX_ALARM, setEX_ALARM] = useState(initialEX_ALARM);
  const itemsPerPage = 5;
  const pageButtonCount = 5;
  const [currentItems, setCurrentItems] = useState(
    EX_ALARM.slice(0, itemsPerPage)
  );

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(EX_ALARM.slice(startIndex, endIndex));
  }, [currentPage, EX_ALARM]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  const handleAllRead = () => {
    const updatedItems = EX_ALARM.map((item, index) => {
      if (
        index >= (currentPage - 1) * itemsPerPage &&
        index < currentPage * itemsPerPage
      ) {
        return { ...item, read: true };
      }
      return item;
    });
    setEX_ALARM(updatedItems);
    alert("모두 읽음");
  };

  return (
    <Wrapper>
      <MyAlertContent>
        <Alert>
          <Top>
            <Small>알림 페이지</Small>
            <Right>
              <AllRead onClick={handleAllRead}>
                <Image
                  src="/assets/icons/check_circle.svg"
                  width={16}
                  height={16}
                  alt="check"
                />
                모두 읽음 표시
              </AllRead>
              <Select>선택</Select>
            </Right>
          </Top>
          <AlertList>
            {currentItems.map((data, index) => (
              <AlertBox
                key={index}
                content={data.content}
                time={data.time}
                read={data.read}
              />
            ))}
          </AlertList>
          <Pagination
            currentPage={currentPage}
            totalItems={EX_ALARM.length}
            itemsPerPage={itemsPerPage}
            pageButtonCount={pageButtonCount}
            onPageChange={handlePageChange}
          />
        </Alert>
      </MyAlertContent>
    </Wrapper>
  );
};

export default MyAlertPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 140px;
`;

const MyAlertContent = styled.div`
  max-width: 1440px;
  width: 100%;
  padding: 0 80px;
`;

const Alert = styled.header`
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
  border-bottom: 1px solid ${theme.colors.gray400};
`;

const Small = styled.div`
  width: 100%;
  ${(props) => props.theme.fonts.medium16};
  color: ${theme.colors.gray700};
  padding-bottom: 27px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 47px;
  white-space: nowrap;
`;

const AllRead = styled.button`
  height: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.semiBold14};
`;

const Select = styled.button`
  height: 16px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.semiBold14};
`;

const AlertList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-top: 32px;
  margin-bottom: 60px;
`;
