import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

interface PaginationProps {
    total: number;
    limit: number;
    page: number;
    setPage: any;
};
const MAX_PAGE_COUNT = 5;

const Pagination = (props: PaginationProps) => {
    const { total, limit, page, setPage } = props;

    const numPages = Math.ceil(total / limit);
    let firstPage = Math.ceil((page / MAX_PAGE_COUNT) - 1) * MAX_PAGE_COUNT;
    let lastPage = firstPage + 5;

    if (numPages < lastPage) {
        lastPage = numPages;
    }

    const getPaginationArray = (startPage: number, pageLength: number) => {
        let pageNumbers: number[] = [];

        if ((startPage + 1) % MAX_PAGE_COUNT === 1) {
            let idx = 1;
            pageNumbers = [startPage];
            while (pageNumbers.length < MAX_PAGE_COUNT && startPage + idx < pageLength) {
                pageNumbers.push(startPage + idx);
                idx++;
            }
        } else if (startPage % MAX_PAGE_COUNT === MAX_PAGE_COUNT - 1) {
            let idx = 1;
            pageNumbers = [startPage];
            while (pageNumbers.length < MAX_PAGE_COUNT) {
                pageNumbers.unshift(startPage - idx);
                idx++;
            }
        }
        return pageNumbers;
    };
    return (
        <>
            <Wrapper>
                <Button>
                    <Image
                        src="/assets/icons/paging_left_arrow.svg"
                        width={14}
                        height={26}
                        alt="previous page" />
                </Button>
                <PageList>
                    {getPaginationArray(firstPage, lastPage).map(i => {
                        return (
                            <PageButton key={i + 1}
                                onClick={() => setPage(i + 1)}>
                                {i + 1}
                            </PageButton>
                        )
                    })}
                </PageList>
                <Button>
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
    &:focus{
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold14};
    }
`