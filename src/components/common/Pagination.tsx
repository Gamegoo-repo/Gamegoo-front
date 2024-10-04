import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  hasMoreItems: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageClick: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  pageButtonCount?: number;
  totalPage?: number;
}

const Pagination = (props: PaginationProps) => {
  const {
    currentPage,
    hasMoreItems,
    onPrevPage,
    onNextPage,
    onPageClick,
    totalItems,
    itemsPerPage,
    pageButtonCount = 5,
    totalPage,
  } = props;

  const totalPages = totalPage
    ? totalPage
    : hasMoreItems
    ? currentPage + 1
    : currentPage;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <Wrapper>
        <Button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          $isDisabled={currentPage === 1}
        >
          <Image
            src={
              currentPage === 1
                ? "/assets/icons/paging_disabled_left_arrow.svg"
                : "/assets/icons/paging_left_arrow.svg"
            }
            width={14}
            height={26}
            alt="이전 페이지"
          />
        </Button>
        <PageList>
          {pages.map((page) => (
            <PageButton
              key={page}
              $isActive={page === currentPage}
              onClick={() => onPageClick(page)}
            >
              {page}
            </PageButton>
          ))}
        </PageList>
        <Button
          onClick={onNextPage}
          disabled={currentPage === totalPage}
          $isDisabled={currentPage === totalPage}
        >
          <Image
            src={
              currentPage === totalPage
                ? "/assets/icons/paging_disabled_right_arrow.svg"
                : "/assets/icons/paging_right_arrow.svg"
            }
            width={14}
            height={26}
            alt="다음 페이지"
          />
        </Button>
      </Wrapper>
    </>
  );
};

export default Pagination;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Button = styled.button<{ $isDisabled: boolean }>`
  color: ${({ $isDisabled }) =>
    $isDisabled ? `${theme.colors.gray300}` : "#2D2D2D"};
  cursor: ${({ $isDisabled }) => ($isDisabled ? `unset` : "pointer")};
`;
const PageList = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 0 36px;
`;
const PageButton = styled.span<{ $isActive: boolean }>`
  padding: 8px 11px;
  border-radius: 9px;
  &:hover {
    background: #f9f8ff;
  }
  color: ${({ $isActive }) =>
    $isActive ? `${theme.colors.purple100}` : "#A1A1A8"};
  ${(props) =>
    props.$isActive ? props.theme.fonts.bold14 : props.theme.fonts.regular14};
`;
