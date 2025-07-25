"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { AlertBox, Pagination } from "@/components";
import { setNotiCount } from "@/redux/slices/notiSlice";
import { theme } from "@/styles/theme";
import { notificationApi } from "@/utils/api";

import type { RootState } from "@/redux/store";
import type { Notification } from "@/types";

const MyAlertPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [notiList, setNotiList] = useState<Notification[] | undefined>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const pageButtonCount = 5;

  const notiCount = useSelector((state: RootState) => state.noti.count);

  useEffect(
    () => {
      const fetchNotiList = async () => {
        try {
          const response = await notificationApi.getNotificationListByPage({
            page: currentPage,
          });
          if (response.data) {
            const { notificationList, totalPage, totalElements } =
              response.data;
            setNotiList(notificationList);
            setTotalPages(totalPage || 0);
            setTotalItems(totalElements || 0);
          } else {
            console.error(response.message);
          }
        } catch (error) {
          console.error(error);
        }
      };

      const fetchNotiCount = async () => {
        try {
          const response = await notificationApi.getUnreadNotificationCount();
          if (!response.data)
            throw new Error("안 읽은 알림 개수 조회 데이터 응답이 없습니다.");
          dispatch(setNotiCount(response.data));
        } catch (error) {
          console.error(error);
        }
      };

      fetchNotiList();
      fetchNotiCount();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage]
  );

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

  const handleClickAlert = async (
    notificationId: number | undefined,
    pageUrl: string | undefined
  ) => {
    // 관련 페이지 이동
    if (pageUrl === undefined) return;
    router.push(pageUrl);

    // 읽음 상태 업데이트
    const notification = notiList?.find(
      (n) => n.notificationId === notificationId
    );
    if (notification && !notification.read) {
      try {
        await notificationApi.readNotification({
          notificationId: notificationId || 0,
        });
        setNotiList((prevNotiList) =>
          prevNotiList?.map((n) =>
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
          {/* <Top>알림 페이지 ({notiCount})</Top> */}
          <Top>알림</Top>
          {notiList != undefined && notiList.length > 0 ? (
            <>
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
            <NoData>새로운 알림이 없습니다.</NoData>
          )}
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
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding-top: 20px;
  }
`;

const MyAlertContent = styled.div`
  max-width: 1440px;
  width: 100%;
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0 20px;
  }
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
  ${(props) => props.theme.fonts.bold25};
  padding-bottom: 13px;
  border-bottom: 1px solid ${theme.colors.gray300};
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold18};
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const AlertList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-top: 32px;
  margin-bottom: 60px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    margin-top: 20px;
  }
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
