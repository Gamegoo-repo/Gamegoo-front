import React from "react";
import clsx from "clsx";
import styled from "styled-components";

import { Button } from "@/components";
import Icon from "@/components/common/Icon";
import { ICON } from "@/constants/icon";
import { useMediaQueryContext } from "@/hooks";

import type { AlertPayload } from "@/redux/slices/modalSlice";
import type { RootState } from "@/redux/store";
import type { BoardListDetail } from "@/types";

interface BoardHeaderProps {
  isRotating: boolean;
  onClickRefresh: () => void;
  boardList: BoardListDetail[];
  isUser: RootState["user"];
  onWriteClick: () => { payload: AlertPayload; type: string } | undefined;
  onPullUpClick: () => Promise<void>;
}

interface MobileHeaderProps {
  boardList: BoardListDetail[];
  isUser: RootState["user"];
  onWriteClick: () => void;
  onPullUpClick: () => Promise<void>;
}

interface DesktopHeaderProps {
  isRotating: boolean;
  onClickRefresh: () => void;
}

export default function BoardHeader({
  isRotating,
  onClickRefresh,
  boardList,
  isUser,
  onWriteClick,
  onPullUpClick,
}: BoardHeaderProps) {
  const { isMobile } = useMediaQueryContext();

  return isMobile ? (
    <MobileHeader
      onPullUpClick={onPullUpClick}
      onWriteClick={onWriteClick}
      isUser={isUser}
      boardList={boardList}
    />
  ) : (
    <DesktopHeader onClickRefresh={onClickRefresh} isRotating={isRotating} />
  );
}

function MobileHeader({
  isUser,
  boardList,
  onPullUpClick,
  onWriteClick,
}: MobileHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center mb-[38px] sm:mb-[12px]">
      <BoardTitle />

      <div className="flex gap-[8px]">
        {boardList?.length > 0 && isUser?.id ? (
          <button
            className="flex items-center gap-[4.5px] bg-gradient"
            onClick={onPullUpClick}
          >
            <Icon backgroundUrl={ICON.PULL_UP_WHITE} width={15} height={15} />
          </button>
        ) : null}

        <Button
          width="104px"
          height="38px"
          onClick={onWriteClick}
          buttonType="primary"
          size="large"
          text="글 작성하기"
        />
      </div>
    </div>
  );
}

function DesktopHeader({ onClickRefresh, isRotating }: DesktopHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between mb-3 mobile:mb-[38px]">
      <BoardTitle />
      <button
        className="w-11 h-11 flex justify-center items-center gap-2.5 p-2.5 rounded-lg border border-violet-200 bg-violet-100"
        onClick={onClickRefresh}
      >
        <Icon
          backgroundUrl={ICON.REDO}
          width={20}
          height={20}
          className={clsx("cursor-pointer", isRotating && "animate-rotate")}
        />
      </button>
    </div>
  );
}

const BoardTitle = () => (
  <h1 className="inline-block text-gray-700 font-bold text-xl sm:text-[32px]">
    게시판
  </h1>
);
