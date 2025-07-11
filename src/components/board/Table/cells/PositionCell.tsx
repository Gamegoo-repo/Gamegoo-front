import Image from "next/image";
import styled from "styled-components";

import { setPositionImg } from "@/utils";

import type { Position } from "@/types";

export const PositionCell = ({
  mainP,
  subP,
}: {
  mainP: Position;
  subP: Position;
}) => (
  <Fourth className="table_width">
    <Image
      src={setPositionImg(mainP)}
      width={36}
      height={36}
      alt="메인 포지션"
    />
    <Image
      src={setPositionImg(subP)}
      width={36}
      height={36}
      alt="서브 포지션"
    />
  </Fourth>
);

const Fourth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 21px;
`;
