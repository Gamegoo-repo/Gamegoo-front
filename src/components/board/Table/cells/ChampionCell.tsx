import styled from "styled-components";

import { Champion } from "@/components/common";

export const ChampionCell = ({ champions }: { champions: any[] }) => (
  <Sixth className="table_width">
    <Champion font="semiBold14" list={champions || []} />
  </Sixth>
);

const Sixth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;
