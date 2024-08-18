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
  placeholder?: string;
  isValid?: null | boolean;
  disabled?: boolean;
  height?: string;
  errorMsg?: string;
  checkIcon?: boolean;
  fontSize?: string;
  borderRadius?: string;
  tag?: boolean;
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
    placeholder,
    isValid,
    disabled,
    height,
    errorMsg = "사용불가",
    checkIcon = true,
    fontSize,
    borderRadius,
    tag = false,
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
          $borderRadius={borderRadius || "15px"}
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
            placeholder={placeholder}
            isValid={isValid}
            disabled={disabled}
            borderRadius={borderRadius || "15px"}
            height={height}
            tag={tag}
            onBlur={onBlur}
          />
          {tag && <Tag>#</Tag>}
          {isValid !== undefined && (
            <Valid>
              {isValid === true && checkIcon === true && (
                <Image
                  src="/assets/icons/check.svg"
                  width={19}
                  height={13}
                  alt="check"
                />
              )}
              {isValid === false && <Error>{errorMsg}</Error>}
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
  min-height: ${({ height }) => (height ? height : "58px")};
  padding: ${({ tag }) => (tag ? "11px 30px" : "11px 20px")};
  border-radius: ${({ borderRadius }) =>
    borderRadius ? borderRadius : "15px"};
  border: ${({ isValid }) =>
    isValid === undefined
      ? `1px solid #b5b5b5`
      : isValid === true
      ? `1px solid ${theme.colors.purple300}`
      : `1px solid ${theme.colors.error100}`};
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.regular16}

  &:focus {
    outline: none;
    border: ${({ isValid }) =>
      isValid === undefined && `1px solid ${theme.colors.purple300}`};
  }

  &:disabled {
    background: ${theme.colors.purple500};
  }

  &::placeholder {
    color: #c0c0c0;
  }
`;

const StyledTextarea = styled.textarea<{
  $height: string | undefined;
  $borderRadius: string | undefined;
  $fontSize: string | undefined;
}>`
  width: 100%;
  padding: 11px 20px;
  border-radius: ${({ $borderRadius }) =>
    $borderRadius ? $borderRadius : "15px"};
  border: 1px solid #b5b5b5;
  color: ${theme.colors.black};
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
    border: 1px solid ${theme.colors.purple300};
  }
  &::placeholder {
    color: #7c7c7c;
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
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.medium16}
`;

const Valid = styled.div`
  position: absolute;
  top: 50%;
  right: 23px;
  transform: translate(0, -50%);
`;

const Error = styled.div`
  color: ${theme.colors.error100};
  ${(props) => props.theme.fonts.regular12}
`;
