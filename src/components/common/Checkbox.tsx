import { theme } from "@/styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface CheckboxProps {
  value: number | string;
  label?: string;
  isChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  isArraychecked?: boolean;
  onArrayChange?: (checked: number | string) => void;
  fontSize?: string;
  id?: string;
}

const Checkbox = (props: CheckboxProps) => {
  const {
    value,
    label,
    isChecked = false,
    onChange,
    isArraychecked,
    onArrayChange,
    fontSize,
    id
  } = props;
  const [checked, setChecked] = useState<boolean>(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (onArrayChange) {
      onArrayChange(value);
    }
  };

  return (
    <StyledCheckbox fontSize={fontSize || "semiBold16"}>
      <Check
        id={id}
        value={value}
        type="checkbox"
        checked={isChecked ? checked : isArraychecked}
        onChange={handleChange}
      />
      {label}
    </StyledCheckbox>
  );
};

export default Checkbox;

const StyledCheckbox = styled.div<{ fontSize: string }>`
  display: flex;
  align-items: center;
  gap: 1.7rem;
  row-gap: 20rem;
  cursor: pointer;
  ${(props) =>
    props.fontSize
      ? props.theme.fonts[props.fontSize as keyof typeof props.theme.fonts]
      : props.theme.fonts.semiBold16};
  color: ${theme.colors.black};
  cursor: pointer;
`;
const Check = styled.input`
  width: 100%;
  appearance: none;
  width: 22px;
  height: 22px;
  border: 0.3px solid #bebebe;
  background-color: ${theme.colors.white};
  border-radius: 2.8px;
  outline: none;

  &:hover {
    box-shadow: 0 0 0 max(0, 0.3em) ${theme.colors.purple500};
  }

  &:checked {
    border: none;
    background-image: url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Group 3016'%3E%3Crect id='Rectangle 6578' x='0' y='0' width='20' height='20' rx='2.45221' fill='%235A42EE' stroke='%235A42EE' stroke-width='0.70063'/%3E%3Cpath id='Vector' d='M7.61237 13.5834L4.85528 11.0699C4.70671 10.9345 4.50522 10.8584 4.29512 10.8584C4.08501 10.8584 3.88352 10.9345 3.73496 11.0699C3.58639 11.2054 3.50293 11.3891 3.50293 11.5806C3.50293 11.6754 3.52342 11.7693 3.56323 11.857C3.60304 11.9446 3.66139 12.0242 3.73496 12.0912L7.05619 15.119C7.36606 15.4015 7.86663 15.4015 8.17651 15.119L16.5829 7.45549C16.7314 7.32006 16.8149 7.13637 16.8149 6.94484C16.8149 6.7533 16.7314 6.56961 16.5829 6.43418C16.4343 6.29874 16.2328 6.22266 16.0227 6.22266C15.8126 6.22266 15.6111 6.29874 15.4626 6.43418L7.61237 13.5834Z' fill='white'/%3E%3C/g%3E%3C/svg%3E%0A");
    background-position: 50%;
    background-repeat: no-repeat;
  }
`;
