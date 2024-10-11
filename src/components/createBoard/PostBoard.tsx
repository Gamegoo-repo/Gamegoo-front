import styled from "styled-components";
import Dropdown from "../common/Dropdown";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import CRModal from "../crBoard/CRModal";
import UpdateProfileImage from "./UpdateProfileImage";
import User from "../crBoard/User";
import Toggle from "../common/Toggle";
import PositionBox, { PositionState } from "../crBoard/PositionBox";
import GameStyle from "./GameStyle";
import ConfirmModal from "../common/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { editPost, postBoard } from "@/api/board";
import {
  clearCurrentPost,
  PostUpdate,
  setPostStatus,
  updateCurrentPost,
} from "@/redux/slices/postSlice";
import { PostReq } from "@/interface/board";
import Alert from "../common/Alert";
import { useRouter } from "next/navigation";
import { setOpenModal } from "@/redux/slices/modalSlice";
import { getProfile } from "@/api/user";
import { setUserProfile } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";

interface PostBoardProps {
  onClose: () => void;
  onCompletedPostingClose: () => void;
}

const DROP_DATA = [
  { id: 1, value: "빠른대전" },
  { id: 2, value: "솔로랭크" },
  { id: 3, value: "자유랭크" },
  { id: 4, value: "칼바람 나락" },
];

const PostBoard = (props: PostBoardProps) => {
  const { onClose, onCompletedPostingClose } = props;

  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.user);
  const currentPost = useSelector((state: RootState) => state.post.currentPost);
  const currentPostId = useSelector(
    (state: RootState) => state.post.currentPostId
  );
  const isCompletedModal = useSelector(
    (state: RootState) => state.modal.modalType
  );

  const [isProfileListOpen, setIsProfileListOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<
    number | undefined
  >(currentPost?.profileImage ?? user?.profileImg);
  const [selectedDropOption, setSelectedDropOption] = useState<number>(
    currentPost?.gameMode || 1
  );
  const [positionValue, setPositionValue] = useState<PositionState | undefined>(
    {
      main: currentPost?.mainPosition || user?.mainP || 0,
      sub: currentPost?.subPosition || user?.subP || 0,
      want: currentPost?.wantPosition || 0,
    }
  );
  const [isMicOn, setIsMicOn] = useState<boolean>(currentPost?.mike || false);
  const gameStyleIds =
    user?.gameStyleResponseDTOList?.map((item) => item.gameStyleId) || [];
  const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(
    currentPost?.gameStyles ?? gameStyleIds
  );
  const [textareaValue, setTextareaValue] = useState<string>(
    currentPost?.contents || ""
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        dispatch(setUserProfile(response));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  // 모달이 열렸을 때 body 스크롤을 막기
  useEffect(() => {
    // 모달이 열리면 body 스크롤 비활성화
    document.body.style.overflow = "hidden";

    // 모달이 닫히면 다시 스크롤 활성화
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!!currentPost) {
      setSelectedDropOption(currentPost.gameMode);

      setPositionValue({
        main: currentPost.mainPosition,
        sub: currentPost.subPosition,
        want: currentPost.wantPosition,
      });

      setSelectedImageIndex(currentPost.profileImage);
      setIsMicOn(currentPost.mike);
      setSelectedStyleIds(currentPost.gameStyles);
      setTextareaValue(currentPost.contents);
    }
  }, [currentPost]);

  /* userInfo가 업데이트된 후 상태 업데이트 */
  useEffect(() => {
    if (!!user.gameName && !currentPost) {
      setPositionValue({
        main: user.mainP ? user.mainP : 0,
        sub: user.subP ? user.subP : 0,
        want: 0,
      });
      setSelectedImageIndex(user.profileImg);
      const ids =
        user?.gameStyleResponseDTOList?.map((item) => item.gameStyleId) || [];
      setSelectedStyleIds(ids);
    }
  }, [user, currentPost]);

  /* 프로필 이미지 리스트 중 클릭시 */
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index + 1);
    setTimeout(() => {
      setIsProfileListOpen(false);
    }, 300); // 300ms 후에 창이 닫히도록 설정
  };

  /* 큐타입 선택 */
  const handleDropValue = (id: number | null) => {
    if (!id) return;
    setSelectedDropOption(id);
    setIsDropdownOpen(false);
  };

  /* 큐타입 드롭박스 외부 영역 클릭 시 드롭박스 닫힘 */
  const handleDropdownClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleDropdownClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleDropdownClickOutside);
    };
  }, []);

  /* 포지션 선택 */
  const handlePositionChange = (newPositionValue: PositionState) => {
    setPositionValue(newPositionValue);
  };

  /* 마이크 유무 선택 */
  const toggleMicHandler = () => {
    setIsMicOn(!isMicOn);
  };

  /* 글 수정 */
  const handleEdit = async (params: PostReq) => {
    if (!currentPostId) return;

    try {
      await editPost(currentPostId, params);
      await dispatch(setPostStatus("edit"));
      await dispatch(
        updateCurrentPost({
          currentPostId,
          updates: params as PostUpdate,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  /* 글쓰기 */
  const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user.gameName) {
      return setShowAlert(true);
    }

    if (
      selectedImageIndex === undefined ||
      selectedDropOption === undefined ||
      !positionValue ||
      positionValue.main === undefined ||
      positionValue.sub === undefined ||
      positionValue.want === undefined ||
      textareaValue.trim() === ""
    )
      return;

    const params = {
      boardProfileImage: selectedImageIndex,
      gameMode: selectedDropOption,
      mainPosition: positionValue.main,
      subPosition: positionValue.sub,
      wantPosition: positionValue.want,
      mike: isMicOn,
      gameStyles: selectedStyleIds,
      contents: textareaValue,
    };

    if (!!currentPost) {
      handleEdit(params);
      handleModalClose();
    }

    if (!currentPost) {
      try {
        await postBoard(params);
        await dispatch(setPostStatus("complete"));
        await dispatch(setOpenModal("isCompleted"));
      } catch (error) {
        console.error(error);
      }
    }
  };

  /* 모달 닫기 */
  const handleModalClose = () => {
    onClose();
    dispatch(clearCurrentPost());
  };



  return (
    <CRModal type="posting" onClose={handleModalClose}>
      {showAlert && (
        <Alert
          icon="exclamation"
          width={68}
          height={58}
          content="로그아웃 되었습니다. 다시 로그인 해주세요."
          alt="로그인 필요"
          onClose={() => router.push("/login")}
          buttonText="로그인하기"
        />
      )}

      {isCompletedModal && (
        <ConfirmModal
          width="540px"
          primaryButtonText="확인"
          onPrimaryClick={onCompletedPostingClose}
        >
          {isCompletedModal === "isCompleted"
            ? "글 작성이 완료되었습니다."
            : "글 수정이 완료되었습니다."}
        </ConfirmModal>
      )}

      <Form onSubmit={handlePost}>
        {user.gameName && (
          <UserSection>
            <UpdateProfileImage
              selectedImageIndex={selectedImageIndex}
              setIsProfileListOpen={setIsProfileListOpen}
              isProfileListOpen={isProfileListOpen}
              onImageClick={handleImageClick}
            />
            <User
              account={user.gameName}
              tag={user.tag}
              tier={user.tier}
              rank={user.rank}
            />
          </UserSection>
        )}

        <QueueNMicSection>
          <Div>
            <Title className="micTitle">마이크</Title>
            <Toggle isOn={isMicOn} onToggle={toggleMicHandler} type="board" />
          </Div>
          <Div>
            <Title className="queueTitle">큐타입</Title>
            <Dropdown
              ref={dropdownRef}
              type="type2"
              padding="11px 21px"
              width="234px"
              list={DROP_DATA}
              open={isDropdownOpen}
              setOpen={setIsDropdownOpen}
              onDropValue={handleDropValue}
              defaultValue={selectedDropOption}
            />
          </Div>
        </QueueNMicSection>
        {selectedDropOption !== 4 &&
          <PositionSection>
            <Title className="positionTitle">포지션</Title>
            <PositionBox
              status="posting"
              onPositionChange={handlePositionChange}
              main={positionValue?.main}
              sub={positionValue?.sub}
              want={positionValue?.want}
            />
          </PositionSection>
        }
        <StyleSection>
          <Title className="gameStyleTitle">게임 스타일</Title>
          {user.gameName && (
            <GameStyle
              selectedIds={selectedStyleIds}
              setSelectedStyleIds={setSelectedStyleIds}
            />
          )}
        </StyleSection>
        <MemoSection>
          <Title className="memoTitle">메모</Title>
          <InputWrapper>
            <Input
              height="100px"
              inputType="textarea"
              value={textareaValue}
              id="memo"
              fontSize="regular16"
              onChange={(value) => {
                if (value.length <= 1000) {
                  setTextareaValue(value);
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TextCount $isFocused={isFocused}>
              {textareaValue.length}/1000
            </TextCount>
          </InputWrapper>
        </MemoSection>
        <ButtonContent className={`baseMargin ${selectedStyleIds.length === 0 && selectedDropOption === 4
          ? 'margin-1'
          : selectedStyleIds.length !== 0 && selectedDropOption === 4
            ? 'margin-2'
            : ''
          }`}>
          <Button
            type="submit"
            buttonType="primary"
            text="확인"
            disabled={textareaValue.trim() == ""}
          />
        </ButtonContent>
      </Form>
    </CRModal>
  );
};

export default PostBoard;

const Form = styled.form``;
const Title = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: #2d2d2d;
  &.micTitle {
    margin-bottom: 11px;
  }
  &.queueTitle {
    margin-bottom: 5px;
  }
  &.positionTitle {
    margin-bottom: 5px;
  }
  &.gameStyleTitle {
    margin-bottom: 5px;
  }
  &.memoTitle {
    margin-bottom: 5px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 17px;
`;
const QueueNMicSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 187px;
  margin-top: 24px;
`;

const Div = styled.div``;

const PositionSection = styled.div`
  margin-top: 33px;
`;

const StyleSection = styled.div`
  margin-top: 34px;
`;

const MemoSection = styled.div`
  margin-top: 34px;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 3px;
`;

const TextCount = styled.div<{ $isFocused: boolean }>`
  margin-right: 20px;
  color: ${({ $isFocused, theme }) =>
    $isFocused ? theme.colors.purple300 : "#b5b5b5"};
  ${theme.fonts.regular12};
  z-index: 100;
`;

const ButtonContent = styled.p`
  padding: 0 0 28px;
  text-align: center;
  margin-top: 54px;

  &.margin-1{
    margin-top:258px;
  }
  &.margin-2 {
    margin-top: 221px;
  }
`;

