import { useState } from "react";
import { useDispatch } from "react-redux";

import { updateMike } from "@/redux/slices/matchInfo";

import type { Mike as MikeType, User } from "@/types";

export const useMike = (user: User) => {
  const dispatch = useDispatch();
  const [isMike, setIsMike] = useState<MikeType>(user.mike);

  const handleMike = () => {
    const next = isMike === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    setIsMike(next);
    dispatch(updateMike(next));
  };

  return { isMike, handleMike, setIsMike };
};
