import Image from "next/image";

import { setPositionImg } from "@/utils";

import type { Position } from "@/types";

export const PositionCell = ({
  mainP,
  subP,
}: {
  mainP: Position;
  subP: Position;
}) => (
  <div className="table_width flex items-center justify-center gap-[21px]">
    <Image
      src={setPositionImg(mainP)}
      width={32}
      height={32}
      alt="메인 포지션"
    />
    <Image
      src={setPositionImg(subP)}
      width={32}
      height={32}
      alt="서브 포지션"
    />
  </div>
);
