import dayjs from "dayjs";

import type { ChatMessageDto } from "@/types";

export const useDisplayHelpers = () => {
  /* 채팅 날짜 표시 */
  const handleDisplayDate = (
    messages: ChatMessageDto[],
    index: number
  ): boolean => {
    if (index === 0) return true;

    const currentDate = dayjs(messages[index].createdAt).format("YYYY-M-D");
    const previousDate = dayjs(messages[index - 1].createdAt).format(
      "YYYY-M-D"
    );

    return currentDate !== previousDate;
  };

  /* 메시지 시간 표시 (마지막 메시지에만 시간 표시, 상대방 메시지 중간에 오면 다시 표시) */
  const handleDisplayTime = (
    messages: ChatMessageDto[],
    index: number
  ): boolean => {
    if (index === messages.length - 1) return true;

    const currentTime = dayjs(messages[index].createdAt).format("A hh:mm");
    const nextTime = dayjs(messages[index + 1].createdAt).format("A hh:mm");

    const isSameTime = currentTime === nextTime;
    const isSameSender =
      messages[index].senderId === messages[index + 1].senderId;

    return !(isSameTime && isSameSender);
  };

  /* 프로필 이미지 표시 (상대방만 보여주기, 같은 시간에 온 경우 첫번째 메시지만 이미지 표시) */
  const handleDisplayProfileImage = (
    messages: ChatMessageDto[],
    index: number
  ): boolean => {
    if (index === 0) return true;

    const currentSenderId = messages[index].senderId;
    const previousSenderId = messages[index - 1].senderId;

    const currentTime = dayjs(messages[index].createdAt).format("A hh:mm");
    const previousTime = dayjs(messages[index - 1].createdAt).format("A hh:mm");

    return currentSenderId !== previousSenderId || currentTime !== previousTime;
  };

  return {
    handleDisplayDate,
    handleDisplayTime,
    handleDisplayProfileImage,
  };
};
