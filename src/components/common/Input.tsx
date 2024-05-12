import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface InputProps {
  inputType?: "input" | "password" | "textarea";
  size?: "small" | "medium" | "large";
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isValid?: boolean;
}

const Input = (props: InputProps) => {
  const {
    inputType = "input",
    size,
    label,
    value,
    onChange,
    placeholder,
    isValid,
  } = props;

  const handleChange = (event: any) => {
    onChange(event.target.value);
  };

  return (
    <Element>
      {label && <StyledLabel>{label}</StyledLabel>}
      {inputType === "textarea" ? (
        <StyledTextarea
          className={size}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
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
          />
          {isValid !== undefined && (
            <Valid>
              {isValid === true && (
                <Image
                  src="/assets/icons/check.svg"
                  width={19}
                  height={13}
                  alt="check"
                />
              )}
              {isValid === false && <Error>사용불가</Error>}
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
  height: 58px;
  padding: 17px 23px;
  border-radius: 9px;
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

  &::placeholder {
    color: #c0c0c0;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 11px 20px;
  border-radius: 14px;
  border: 1px solid #b5b5b5;
  color: ${theme.colors.black};
  ${(props) => props.theme.fonts.regular20};
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