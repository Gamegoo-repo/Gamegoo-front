import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";

import { deletePost, pullUpPost } from "@/api";
import { notify } from "@/hooks";
import { setRefresh } from "@/redux/slices/boardSlice";
import {
  setCloseReadingModal,
  setOpenPostingModal,
} from "@/redux/slices/modalSlice";
import { setCurrentPost, setPostStatus } from "@/redux/slices/postSlice";
import { RootState } from "@/redux/store";
import type { MemberPost } from "@/types";

import { PostItemData } from "../PostItem";

interface UsePostActionsProps {
  data: PostItemData;
  variant: "list" | "mypage";
  isPost: MemberPost | undefined;
  onDeletePost?: (boardId: number) => void;
  showAlertWithContent: (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => void;
}

interface UsePostActionsReturn {
  isPullUpConfirmOpen: boolean;
  setIsPullUpConfirmOpen: (open: boolean) => void;
  handlePullUp: () => void;
  handlePullUpAction: () => Promise<void>;
  handleEdit: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export const usePostActions = ({
  data,
  variant,
  isPost,
  onDeletePost,
  showAlertWithContent,
}: UsePostActionsProps) => {
  const _return = useRef<UsePostActionsReturn>();
  const dispatch = useDispatch();
  const router = useRouter();
  const isUser = useSelector((state: RootState) => state.user);

  const [isPullUpConfirmOpen, setIsPullUpConfirmOpen] = useState(false);

  const logoutMessage = "로그아웃 되었습니다. 다시 로그인 해주세요.";

  /* 게시글 끌어올리기 */
  const handlePullUp = useCallback(() => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }
    setIsPullUpConfirmOpen(true);
    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }
  }, [isUser.id, showAlertWithContent, variant, dispatch, router]);

  const handlePullUpAction = useCallback(async () => {
    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }
    setIsPullUpConfirmOpen(false);
    await pullUpPost(data.boardId!);
    dispatch(setRefresh());

    await notify({
      text: "끌어올리기가 완료되었습니다",
      icon: "👌🏼",
      type: "success",
    });
  }, [variant, dispatch, data.boardId]);

  /* 게시글 수정 */
  const handleEdit = useCallback(async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    if (variant === "mypage" && isPost) {
      await dispatch(
        setCurrentPost({
          currentPost: isPost,
          currentPostId: data.boardId!,
        })
      );
    }

    dispatch(setOpenPostingModal());

    if (variant === "list") {
      dispatch(setCloseReadingModal());
    }

    dispatch(setPostStatus(""));
  }, [
    isUser.id,
    showAlertWithContent,
    variant,
    isPost,
    dispatch,
    data.boardId,
    router,
  ]);

  /* 게시글 삭제 */
  const handleDelete = useCallback(async () => {
    if (!isUser.id) {
      return showAlertWithContent(
        "exclamation",
        logoutMessage,
        () => router.push("/riot"),
        "로그인하기"
      );
    }

    try {
      await deletePost(data.boardId!);
      dispatch(setPostStatus("delete"));

      if (variant === "list") {
        dispatch(setCloseReadingModal());
      }

      if (onDeletePost) {
        onDeletePost(data.boardId!);
      }

      dispatch(setPostStatus(""));
    } catch (error) {
      console.error(error);
    }
  }, [
    isUser.id,
    showAlertWithContent,
    data.boardId,
    variant,
    dispatch,
    onDeletePost,
    router,
  ]);

  if (!_return.current) {
    _return.current = {
      isPullUpConfirmOpen: false,
      setIsPullUpConfirmOpen,
      handlePullUp,
      handlePullUpAction,
      handleEdit,
      handleDelete,
    };
  }

  _return.current.isPullUpConfirmOpen = isPullUpConfirmOpen;
  _return.current.handlePullUp = handlePullUp;
  _return.current.handlePullUpAction = handlePullUpAction;
  _return.current.handleEdit = handleEdit;
  _return.current.handleDelete = handleDelete;

  return _return.current;
};
