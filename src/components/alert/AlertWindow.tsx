import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import AlertBox from "../mypage/notification/AlertBox";
import { useRouter } from "next/navigation";
import { Notification } from "@/app/mypage/notification/page";
import { getNotiModal, readNoti } from "@/api/notification";

interface NotificationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    notificationDTOList: Notification[];
    list_size: number;
    has_next: boolean;
    next_cursor: number | null;
  };
}

interface AlertWindowProps {
  countFunc: () => void;
  onClose: () => void;
}

const AlertWindow = (
  props: AlertWindowProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const router = useRouter();
  const { countFunc, onClose } = props;

  const alertWindowRef = useRef<HTMLDivElement>(null);

  const [notiList, setNotiList] = useState<Notification[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        alertWindowRef.current &&
        !alertWindowRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  /* 알림 목록 조회 */
  const fetchNotiList = async (cursor: number | null) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response: NotificationResponse = await getNotiModal(cursor);
      if (response.isSuccess) {
        const { notificationDTOList, next_cursor, has_next } = response.result;
        setNotiList(notificationDTOList);
        setCursor(next_cursor);
        setHasMore(has_next);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* 초기 호출 */
  useEffect(() => {
    fetchNotiList(cursor);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (alertWindowRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          alertWindowRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
          setIsAtBottom(true);
        } else {
          setIsAtBottom(false);
        }
      }
    };

    if (alertWindowRef.current) {
      alertWindowRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (alertWindowRef.current) {
        alertWindowRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (isAtBottom && hasMore) {
      fetchNotiList(cursor);
    }
  }, [isAtBottom]);

  /* 알림 읽음으로 상태 변경 */
  const handleClickAlert = async (
    notificationId: number,
    pageUrl: string | null
  ) => {
    // 관련 페이지 이동
    if (pageUrl !== null) {
      router.push(pageUrl);
    }

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
        countFunc();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Overlay>
        <Wrapper ref={alertWindowRef}>
          <Header>
            <Top>
              <HeaderTitle>알림</HeaderTitle>
              <AllButton
                onClick={() => {
                  router.push("/mypage/notification");
                  onClose();
                }}
              >
                전체보기
                <Image
                  onClick={onClose}
                  src="/assets/icons/move.svg"
                  width={11}
                  height={11}
                  alt="move button"
                />
              </AllButton>
            </Top>
            <TabContainer>
              <Tab>받은 알림</Tab>
            </TabContainer>
          </Header>
          <Background>
            {notiList.map((data, index) => (
              <AlertBox
                key={`${data.notificationId}-${index}`}
                notificationId={data.notificationId}
                notificationtType={data.notificationType}
                pageUrl={data.pageUrl}
                content={data.content}
                createdAt={data.createdAt}
                read={data.read}
                size="small"
                onClick={handleClickAlert}
              />
            ))}
          </Background>
        </Wrapper>
      </Overlay>
    </>
  );
};

export default AlertWindow;

const Overlay = styled.div`
  width: 408px;
  height: 547px;
  position: absolute;
  top: 60px;
  right: 80px;
  z-index: 100;
`;

const Wrapper = styled.div`
  background: ${theme.colors.white};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  width: 418px;
  box-shadow: 0 4px 46.7px 0 #0000001a;
`;

const Header = styled.header`
  border-radius: 20px 20px 0 0;
  background: ${theme.colors.white};
  box-shadow: 0 -1px 10.7px 0 #00000026;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 23px;
  margin-bottom: 36px;
`;

const HeaderTitle = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray600};
`;

const AllButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 1px;
  ${(props) => props.theme.fonts.bold11};
  cursor: pointer;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 40px;
  padding: 0 30px;
`;

const Tab = styled.button`
  position: relative;
  padding: 4px 0;
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray600};
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    width: 100%;
    height: 4px;
    background-color: ${theme.colors.purple100};
    border-radius: 60px;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }
`;

const Background = styled.div`
  height: 435px;
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 14px 19px;
  background: ${theme.colors.gray500};
  overflow-y: auto;
  border-radius: 0 0 20px 20px;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 66px;
    background: ${theme.colors.gray300};
  }
  &::-webkit-scrollbar-track {
    border-radius: 66px;
    background: transparent;
  }
`;
