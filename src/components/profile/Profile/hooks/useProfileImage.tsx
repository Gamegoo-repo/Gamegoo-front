import { useState } from "react";
import { useDispatch } from "react-redux";

import { putProfileImage } from "@/api";
import { STORAGE_KEY } from "@/constants/storage";
import { setUserProfileImg } from "@/redux/slices/userSlice";

import type { User } from "@/types";

export const useProfileImage = (user: User) => {
  const dispatch = useDispatch();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(
    user.profileImg
  );
  const [isProfileListOpen, setIsProfileListOpen] = useState(false);

  const handleImageClick = async (index: number) => {
    setSelectedImageIndex(index);
    await putProfileImage(index);
    dispatch(setUserProfileImg(index));
    localStorage.setItem(STORAGE_KEY.profileImg, String(index));
    setTimeout(() => setIsProfileListOpen(false), 300);
  };

  return {
    selectedImageIndex,
    setSelectedImageIndex,
    isProfileListOpen,
    setIsProfileListOpen,
    handleImageClick,
  };
};
