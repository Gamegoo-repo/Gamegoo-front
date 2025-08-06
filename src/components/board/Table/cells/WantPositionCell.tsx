import Image from "next/image";

import { setPositionImg } from "@/utils";

import type { Position } from "@/types";

export const WantPositionCell = ({ wantP }: { wantP: (Position | null)[] }) => (
  <div className="table_width flex items-center justify-center  text-center">
    {wantP?.length > 0 ? (
      wantP.map((posi, i) => (
        <Image
          key={`${posi}-${i}`}
          src={setPositionImg(posi || "ANY")}
          width={32}
          height={32}
          alt="찾는 포지션"
        />
      ))
    ) : (
      <Image
        src={setPositionImg("ANY")}
        width={32}
        height={32}
        alt="찾는 포지션"
      />
    )}
  </div>
);
