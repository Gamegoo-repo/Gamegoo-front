import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { putProfilePosition } from "@/@generated/api";
import { putPosition } from "@/api";
import { setMatchInfo } from "@/redux/slices/matchInfo";

import type { MainPEnum, SubPEnum, WantPEnum } from "@/@generated/types";
import type { PositionState } from "@/components/crBoard/PositionBox";
import type { RootState } from "@/redux/store";
import type { User } from "@/types";

export const usePosition = (user: User, profileType: string) => {
  const dispatch = useDispatch();
  const matchInfo = useSelector((state: RootState) => state.matchInfo);

  const [positionValue, setPositionValue] = useState<PositionState>({
    main: user.mainP,
    sub: user.subP,
    want: user.wantP,
  });

  // 포지션 선택해 변경하기
  const handlePositionChange = async (newPosition: PositionState) => {
    if (profileType !== "other" && newPosition.main && newPosition.sub) {
      try {
        // 포지션 변경 API 호출
        await putProfilePosition({
          mainP: newPosition.main as MainPEnum,
          subP: newPosition.sub as SubPEnum,
          wantP: (newPosition.want || []) as Array<WantPEnum>,
        });
        // 포지션 상태 업데이트
        setPositionValue(newPosition);
      } catch (err) {
        console.error("Position update failed", err);
      }
    } else if (["normal", "wind"].includes(profileType)) {
      dispatch(
        setMatchInfo({
          ...matchInfo,
          mainP: newPosition.main ?? "ANY",
          subP: newPosition.sub ?? "ANY",
          wantP: newPosition.want ?? ["ANY", "ANY"],
        })
      );
    }
  };

  return { positionValue, setPositionValue, handlePositionChange };
};
