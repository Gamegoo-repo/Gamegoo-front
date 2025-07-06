import { useState } from "react";

import Image from "next/image";

import styled from "styled-components";

import { getSearchFriend } from "@/api/friend/get";
import { theme } from "@/styles/theme";
import { FriendList } from "@/types/friend/friendList";

interface SearchBarProps {
  onSearch: (friends: FriendList[] | null) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const { onSearch } = props;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim() !== "") {
      try {
        const response = await getSearchFriend(value);
        onSearch(response.data);
      } catch (error) {
        console.error("친구 찾기 실패:", error);
      }
    } else {
      onSearch(null);
    }
  };

  return (
    <SearchWrapper>
      <Search>
        <SearchImage
          src="/assets/icons/search.svg"
          width={17}
          height={16}
          alt="검색하기"
        />
        <SearchInput
          type="text"
          placeholder="친구 검색하기"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Search>
    </SearchWrapper>
  );
};

export default SearchBar;

const SearchWrapper = styled.div`
  padding: 15px 18px 11px;
  border-bottom: 1px solid ${theme.colors.gray200};
`;

const Search = styled.div`
  position: relative;
  width: 100%;
`;

const SearchImage = styled(Image)`
  position: absolute;
  top: 13px;
  left: 15px;
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${theme.colors.gray100};
  border: none;
  outline: none;
  border-radius: 10px;
  padding: 10px 15px 10px 47px;
  ${(props) => props.theme.fonts.regular14};
  color: ${theme.colors.gray800};

  &::placeholder {
    color: ${theme.colors.gray500};
  }
`;
