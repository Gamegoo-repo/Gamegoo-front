import { theme } from "@/styles/theme";
import { useState } from "react";
import styled from "styled-components";

interface RadioCardProps {
  id: string;
  value: string;
  name: string;
  label: string;
  selected: string;
  onChange: (value: string) => void;
}

const RadioCard: React.FC<RadioCardProps> = ({
  id,
  value,
  label,
  selected,
  onChange,
  name,
}) => {
  return (
    <Container>
      <Label htmlFor={id}>
        <RadioInput
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={id === selected}
          onChange={() => onChange(id)}
        />
        {label}
      </Label>
    </Container>
  );
};

const Container = styled.div`
  width: 600px;
  height: 380px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  margin-bottom: 8px;
  background: ${theme.colors.purple300};
  box-shadow: 0px 4px 7.7px 0px rgba(0, 0, 0, 0.25);
`;

const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.fonts.bold25};
  cursor: pointer;
`;

const RadioInput = styled.input`
  opacity: 0;
`;

export default RadioCard;
