"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import AlertBox from "@/components/mypage/notification/AlertBox";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { getNotiCount, getNotiTotal, readNoti } from "@/api/notification";
import { useRouter } from "next/navigation";
import { setNotiCount } from "@/redux/slices/notiSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ChatButton from "@/components/common/ChatButton";

export interface Notification {
  notificationId: number;
  notificationType: number;
  content: string;
  pageUrl: string;
  read: boolean;
  createdAt: string;
}

const MyAlertPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [notiList, setNotiList] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const pageButtonCount = 5;

  // const [count, setCount] = useState<number>(0);
  const notiCount = useSelector((state: RootState) => state.noti.count);

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

    const fetchNotiCount = async () => {
      try {
        const response = await getNotiCount();
        // setCount(response.result);
        dispatch(setNotiCount(response.result));
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotiList();
    fetchNotiCount();
  }, [currentPage]);

  useEffect(() => {}, [totalPages, totalItems, notiCount]);

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
          <Top>알림 페이지 ({notiCount})</Top>
          {notiList.length > 0 ? (
            <AlertList>
              {notiList.map((data) => (
                <AlertBox
                  key={data.notificationId}
                  notificationId={data.notificationId}
                  notificationtType={data.notificationType}
                  pageUrl={data.pageUrl}
                  content={data.content}
                  createdAt={data.createdAt}
                  read={data.read}
                  onClick={() => {
                    handleClickAlert(data.notificationId, data.pageUrl);
                    dispatch(setNotiCount(notiCount - 1));
                  }}
                />
              ))}
            </AlertList>
          ) : (
            <NoData>새로운 알림이 없습니다.</NoData>
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
        </Alert>
      </MyAlertContent>
      <Footer>
        <ChatBoxContent>
          <ChatButton />
        </ChatBoxContent>
      </Footer>
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
  margin-bottom: 100px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
  padding-bottom: 13px;
  border-bottom: 1px solid ${theme.colors.gray400};
`;

const AlertList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-top: 32px;
  margin-bottom: 60px;
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
