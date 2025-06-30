import { theme } from "@/styles/theme";
import React, { Fragment } from "react";
import styled from "styled-components";

interface CategoryToggleProps {
  categories: { name: string; path: string }[];
  currentPath: string;
  onClick: (item: { name: string; path: string }) => void;
}

const CategoryToggle = (props: CategoryToggleProps) => {
  const { categories, currentPath, onClick } = props;

  return (
    <CategoryToggleContainer>
      {categories.map((item, index) => (
        <Fragment key={item.path}>
          <CategoryToggleButton
            onClick={() => onClick(item)}
            isSelected={currentPath === item.path}
          >
            {item.name}
          </CategoryToggleButton>
        </Fragment>
      ))}
    </CategoryToggleContainer>
  );
};

export default CategoryToggle;

const CategoryToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CategoryToggleButton = styled.button<{ isSelected: boolean }>`
  padding: 8px 16px;
  cursor: pointer;
  background-color: ${theme.colors.white};
  color: ${({ isSelected }) =>
    isSelected ? theme.colors.violet600 : theme.colors.gray700};
  ${({ isSelected }) =>
    isSelected ? theme.fonts.bold16 : theme.fonts.medium16};
  border: ${({ isSelected }) =>
    isSelected
      ? `1px solid ${theme.colors.violet600}`
      : `1px solid ${theme.colors.gray200}`};
  transition: all 0.3s;
`;
