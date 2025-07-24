import { useState } from "react";
import styled from "styled-components";

import { getFriendSearch } from "@/@generated/api";
import { getSearchFriend } from "@/api";
import Icon from "@/components/common/Icon";
import { theme } from "@/styles/theme";

import type { FriendList } from "@/types";

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
        const response = await getFriendSearch(value);
        if (!response.data) {
          throw new Error("친구 목록 검색 데이터 응답이 없습니다.");
        }
        onSearch(response.data as FriendList[]);
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
        <Icon
          backgroundUrl="/assets/icons/search.svg"
          width={17}
          height={16}
          style={{ position: "absolute", top: "13px", left: "15px" }}
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
