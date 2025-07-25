import { useState } from "react";
import { useDispatch } from "react-redux";
import { Mike as MikeType } from "@generated";

import { updateMike } from "@/redux/slices/matchInfo";

import type { User } from "@/types";

export const useMike = (user: User) => {
  const dispatch = useDispatch();
  const [isMike, setIsMike] = useState<MikeType>(user.mike as MikeType);

  const handleMike = () => {
    const next =
      isMike === MikeType.Available ? MikeType.Unavailable : MikeType.Available;
    setIsMike(next);
    dispatch(updateMike(next));
  };

  return { isMike, handleMike, setIsMike };
};
