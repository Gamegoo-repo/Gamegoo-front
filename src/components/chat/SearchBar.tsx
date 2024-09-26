import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

const SearchBar = () => {
    return (
        <SearchWrapper>
            <Search>
                <SearchImage
                    src="/assets/icons/search.svg"
                    width={17}
                    height={16}
                    alt="검색하기" />
                <SearchInput type="text" placeholder="친구 검색하기" />
            </Search>
        </SearchWrapper>
    )
};

export default SearchBar;

const SearchWrapper = styled.div`
    padding:15px 18px 11px;
    border-bottom: 1px solid ${theme.colors.gray400};
`;

const Search = styled.div`
    position: relative;
    width:100%;
`;

const SearchImage = styled(Image)`
    position : absolute;
    top: 13px;
    left: 15px;
    margin: 0;
`;

const SearchInput = styled.input`
    width: 100%;
    background: ${theme.colors.gray500};
    border: 1px solid ${theme.colors.gray500};
    border-radius: 10px;
    padding: 10px 15px 10px 47px;
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.gray200};
`;