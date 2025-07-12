import Image from "next/image";
import styled from "styled-components";

import { setPositionImg } from "@/utils";

import type { Position } from "@/types";

export const WantPositionCell = ({ wantP }: { wantP: (Position | null)[] }) => (
  <Fifth className="table_width">
    {wantP?.length > 0 ? (
      wantP.map((posi, i) => (
        <Image
          key={`${posi}-${i}`}
          src={setPositionImg(posi || "ANY")}
          width={36}
          height={36}
          alt="찾는 포지션"
        />
      ))
    ) : (
      <Image
        src={setPositionImg("ANY")}
        width={35}
        height={28}
        alt="찾는 포지션"
      />
    )}
  </Fifth>
);

const Fifth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
