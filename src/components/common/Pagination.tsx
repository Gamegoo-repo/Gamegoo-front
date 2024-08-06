import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface PaginationProps {
    currentPage: number;
    hasMoreItems: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
    onPageClick: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
    const {
        currentPage,
        hasMoreItems,
        onPrevPage,
        onNextPage,
        onPageClick
    } = props;

    const totalPages = hasMoreItems ? currentPage + 1 : currentPage;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <Wrapper>
                <Button
                    onClick={onPrevPage}
                    disabled={currentPage === 1}
                    $isDisabled={currentPage === 1}>
                    <Image
                        src="/assets/icons/paging_left_arrow.svg"
                        width={14}
                        height={26}
                        alt="previous page" />
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
                    disabled={!hasMoreItems}
                    $isDisabled={!hasMoreItems}>
                    <Image
                        src="/assets/icons/paging_right_arrow.svg"
                        width={14}
                        height={26}
                        alt="next page" />
                </Button>
            </Wrapper>
        </>
    )
};

export default Pagination;

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Button = styled.button < { $isDisabled: boolean }> `
    &:disabled{
        cursor: unset;
    }
`
const PageList = styled.div`
    display: flex;
    align-items: center;
    gap:30px;
    margin:0 36px;
`
const PageButton = styled.span<{ $isActive: boolean }>`
    padding:8px 11px;
    border-radius: 9px;
    ${(props) => props.theme.fonts.regular14};
    &:hover{
        background: #F9F8FF;
    }
    &.active {
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold14};
    }
  color: ${({ $isActive }) => ($isActive ? `${theme.colors.purple100}` : '#A1A1A8')};
  ${(props) =>
        props.$isActive
            ? props.theme.fonts.bold14
            : props.theme.fonts.regular14};
`