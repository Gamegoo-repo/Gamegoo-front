"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import AlertBox from "@/components/mypage/notification/AlertBox";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { getNotiTotal, readNoti } from "@/api/notification";
import { useRouter } from "next/navigation";

interface Notification {
  notificationId: number;
  notificationType: number;
  content: string;
  pageUrl: string;
  read: boolean;
  createdAt: string;
}

const MyAlertPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [notiList, setNotiList] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const pageButtonCount = 5;

  useEffect(() => {
    const fetchNotiList = async () => {
      try {
        const response = await getNotiTotal(currentPage);
        if (response.isSuccess) {
          const { notificationDTOList, totalPage, totalElements } =
            response.result;
          setNotiList(notificationDTOList);
          setTotalPages(totalPage);
          setTotalItems(totalElements);
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotiList();
  }, [currentPage]);

  useEffect(() => {}, [totalPages, totalItems]);

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

  const handleClickAlert = async (notificationId: number, pageUrl: string) => {
    // 관련 페이지 이동
    router.push(pageUrl);

    // 읽음 상태 업데이트
    const notification = notiList.find(
      (n) => n.notificationId === notificationId
    );
    if (notification && !notification.read) {
      try {
        await readNoti(notificationId);
        setNotiList((prevNotiList) =>
          prevNotiList.map((n) =>
            n.notificationId === notificationId ? { ...n, read: true } : n
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Wrapper>
      <MyAlertContent>
        <Alert>
          <Top>
            <Small>알림 페이지</Small>
          </Top>
          <AlertList>
            {notiList.map((data) => (
              <AlertBox
                key={data.notificationId}
                notificationId={data.notificationId}
                pageUrl={data.pageUrl}
                content={data.content}
                createdAt={data.createdAt}
                read={data.read}
                onClick={handleClickAlert}
              />
            ))}
          </AlertList>
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            pageButtonCount={pageButtonCount}
            hasMoreItems={currentPage < totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onPageClick={handlePageClick}
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
