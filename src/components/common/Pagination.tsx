import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    pageButtonCount: number;
    onPageChange: (page: number) => void;
}

const Pagination = (props: PaginationProps) => {
    const {
        currentPage,
        totalItems,
        itemsPerPage,
        pageButtonCount,
        onPageChange } = props;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const halfPageButtonCount = Math.floor(pageButtonCount / 2);
        let startPage = Math.max(1, currentPage - halfPageButtonCount);
        let endPage = Math.min(totalPages, currentPage + halfPageButtonCount);

        if (endPage - startPage + 1 < pageButtonCount) {
            startPage = Math.max(1, endPage - pageButtonCount + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <>
            <Wrapper>
                <Button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                >
                    <Image
                        src="/assets/icons/paging_left_arrow.svg"
                        width={14}
                        height={26}
                        alt="previous page" />
                </Button>
                <PageList>
                    {getPageNumbers().map(page => (
                        <PageButton
                            key={page}
                            className={page === currentPage ? 'active' : ''}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </PageButton>
                    ))}
                </PageList>
                <Button disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
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
const Button = styled.button`
    cursor: pointer;
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
const PageButton = styled.button`
    cursor: pointer;
    color:#A1A1A8;
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
`