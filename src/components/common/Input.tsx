import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface InputProps {
  inputType?: "input" | "password" | "textarea";
  id?: string;
  size?: "small" | "medium" | "large";
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isvalid?: null | boolean;
  disabled?: boolean;
  height?: string;
  errorMsg?: string;
  checkIcon?: boolean;
  fontSize?: string;
  borderRadius?: string;
  $borderradius?: string;
  tag?: boolean;
  $hastag?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLeng?: number;
}

const Input = (props: InputProps) => {
  const {
    inputType = "input",
    id,
    size,
    label,
    value,
    onChange,
    onKeyDown,
    placeholder,
    isvalid,
    disabled,
    height,
    errorMsg = "사용불가",
    checkIcon = true,
    fontSize,
    borderRadius,
    tag = false,
    onFocus,
    onBlur,
    maxLeng,
  } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <Element>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
      {inputType === "textarea" ? (
        <StyledTextarea
          $height={height}
          className={`${height ? "containerHeight" : "height"} ${size}`}
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          $fontSize={fontSize || "regular20"}
          $borderradius={borderRadius || "15px"}
          onFocus={onFocus}
          onBlur={onBlur}
          maxLength={maxLeng}
        />
      ) : (
        <Box>
          <StyledInput
            type={inputType}
            className={size}
            value={value}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            isvalid={isvalid}
            disabled={disabled}
            $borderradius={borderRadius || "15px"}
            height={height}
            $hastag={tag}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {tag && <Tag>#</Tag>}
          {isvalid !== undefined && (
            <Valid>
              {isvalid === true && checkIcon === true && (
                <Image
                  src="/assets/icons/check.svg"
                  width={19}
                  height={13}
                  alt="check"
                />
              )}
              {isvalid === false && <Error>{errorMsg}</Error>}
            </Valid>
          )}
        </Box>
      )}
    </Element>
  );
};

export default Input;

const Element = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const StyledLabel = styled.label`
  text-align: left;
  color: #434343;
  font-size: 14px;
  font-weight: 500;
`;

const StyledInput = styled.input<InputProps>`
  width: 100%;
  height: ${({ height }) => (height ? height : "58px")};
  padding: ${({ $hastag }) => ($hastag ? "11px 30px" : "11px 20px")};
  border-radius: ${({ $borderradius }) =>
    $borderradius ? $borderradius : "15px"};
  border: ${({ isvalid }) =>
    isvalid === undefined
      ? `1px solid ${theme.colors.gray400}`
      : isvalid === true
      ? `1px solid ${theme.colors.violet300}`
      : `1px solid ${theme.colors.red600}`};
  color: ${theme.colors.gray900};
  ${(props) => props.theme.fonts.regular16}

  &:focus {
    outline: none;
    border: ${({ isvalid }) =>
      isvalid === undefined && `1px solid ${theme.colors.violet300}`};
  }

  &:disabled {
    background: ${theme.colors.violet500};
  }

  &::placeholder {
    color: #c0c0c0;
  }
`;

const StyledTextarea = styled.textarea<{
  $height: string | undefined;
  $borderradius: string | undefined;
  $fontSize: string | undefined;
}>`
  width: 100%;
  min-height: 100px;
  padding: 11px 10px 11px 15px;
  border-radius: ${({ $borderradius }) =>
    $borderradius ? $borderradius : "15px"};
  border: 1px solid ${theme.colors.gray400};
  color: ${theme.colors.gray900};
  ${({ $height }) =>
    $height ? `${theme.fonts.regular18}` : `${theme.fonts.regular20}`};
  resize: none;
  min-height: ${({ $height }) => ($height ? $height : "160px")};
  ${(props) =>
    props.$fontSize
      ? props.theme.fonts[props.$fontSize as keyof typeof props.theme.fonts]
      : props.theme.fonts.regular20};
  resize: none;
  &:focus {
    outline: none;
    border: 1px solid ${theme.colors.violet300};
  }
  &::placeholder {
    color: #7c7c7c;
  }

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 6px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Box = styled.div`
  position: relative;
`;

const Tag = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translate(0, -50%);
  color: ${theme.colors.gray900};
  ${(props) => props.theme.fonts.medium16}
`;

const Valid = styled.div`
  position: absolute;
  top: 50%;
  right: 23px;
  transform: translate(0, -50%);
`;

const Error = styled.div`
  color: ${theme.colors.red600};
  ${(props) => props.theme.fonts.regular12}
`;
