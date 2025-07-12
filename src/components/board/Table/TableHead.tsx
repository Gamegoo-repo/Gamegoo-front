import styled from "styled-components";

import type { TableTitleProps } from "@/types/board/table";

interface TableHeadProps {
  title: TableTitleProps[];
}

const TableHead = ({ title }: TableHeadProps) => {
  return (
    <Wrapper>
      {title.map((data) => (
        <Title key={data.id} className="table_width">
          {data.name}
        </Title>
      ))}
    </Wrapper>
  );
};

export default TableHead;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 21px;
  ${(props) => props.theme.fonts.bold14};
  background: ${(props) => props.theme.colors.gray700};
  color: ${(props) => props.theme.colors.white};
  border-radius: 8px;
`;

const Title = styled.p`
  &:first-child {
    text-align: left;
  }
`;
