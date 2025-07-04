import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AxiosError } from "axios";

import PostItem, { PostItemData } from "@/components/common/PostItem";
import { MemberPost } from "@/interface/board";
import { AlertProps } from "@/interface/modal";
import { RootState } from "@/redux/store";
import { User } from "@/interface/profile";
import { getMemberPost, getNonMemberPost } from "@/api/board/board";

export interface PostProps {
  user: User;
  boardId: number;
  memberId: number;
  profileImage: number;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  contents: string;
  createdAt: string;
  bumpTime: string;
  boardNumber: number;
  onDeletePost?: (boardId: number) => void;
}

const MoPost: React.FC<PostProps> = ({
  user,
  boardId,
  memberId,
  profileImage,
  gameName,
  tag,
  tier,
  rank,
  contents,
  createdAt,
  bumpTime,
  boardNumber,
  onDeletePost,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isPost, setIsPost] = useState<MemberPost>();
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertProps, setAlertProps] = useState<AlertProps>({
    icon: "",
    width: 0,
    height: 0,
    content: "",
    alt: "",
    onClose: () => {},
    buttonText: "",
  });

  const isUser = useSelector((state: RootState) => state.user);

  const deletedMessage = "해당 글은 삭제된 글입니다.";

  const showAlertWithContent = (
    icon: string,
    content: string,
    handleAlertClose: () => void,
    btnText: string
  ) => {
    setAlertProps({
      icon: icon,
      width: 68,
      height: 58,
      content: content,
      alt: "경고",
      onClose: handleAlertClose,
      buttonText: btnText,
    });
    setShowAlert(true);
  };

  /* 게시글 api */
  const getPostData = async () => {
    try {
      setLoading(true);

      if (!!isUser.id && boardId) {
        const memberData = await getMemberPost(boardId);
        setIsPost(memberData.data);
      } else if (!isUser.id && boardId) {
        const nonMember = await getNonMemberPost(boardId);
        setIsPost(nonMember.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (
        axiosError?.response?.data?.message === "해당 글은 삭제된 글입니다."
      ) {
        return showAlertWithContent(
          "trash",
          deletedMessage,
          () => {
            setShowAlert(false);
          },
          "확인"
        );
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, [isUser, boardId]);

  const postItemData: PostItemData = {
    boardId,
    memberId,
    profileImage,
    gameName,
    tag,
    mannerLevel: isPost?.mannerLevel || 1,
    tier,
    rank,
    gameMode: isPost?.gameMode || "FAST",
    mainP: user.mainP,
    subP: user.subP,
    wantP: user.wantP,
    championStatsResponseList: isPost?.championStatsResponseList,
    winRate: isPost?.winRate || 56,
    contents,
    createdAt,
    bumpTime,
    soloTier: user.soloTier,
    freeTier: user.freeTier,
    soloRank: user.soloRank,
    freeRanks: user.freeRank,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PostItem
      data={postItemData}
      variant="mypage"
      isClickable={false}
      showTierSection={true}
      showMoreButton={true}
      onDeletePost={onDeletePost}
    />
  );
};

export default MoPost;
