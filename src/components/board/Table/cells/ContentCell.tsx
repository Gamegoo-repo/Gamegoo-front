import styled from "styled-components";

import { theme } from "@/styles/theme";

export const ContentCell = ({ contents }: { contents: string }) => (
  <Eighth className="table_width">
    <Content>{contents}</Content>
  </Eighth>
);

const Eighth = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: -webkit-box;
  width: 156px;
  max-height: 52px;
  padding: 8px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray400};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular13};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
