import styled from "styled-components";

import { theme } from "@/styles/theme";

export const MannerLevelCell = ({ mannerLevel }: { mannerLevel?: number }) => (
  <Second className="table_width">
    {mannerLevel && <p>LV.{mannerLevel}</p>}
  </Second>
);

const Second = styled.div`
  p {
    color: ${theme.colors.violet600};
    ${(props) => props.theme.fonts.bold16};
  }
`;
