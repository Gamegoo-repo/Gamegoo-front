import { STEPS } from "@/constants/match";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ChevronRightGray from "../../../public/assets/icons/chevron_right_gray.svg";

interface StepNavigationProps {
  title: string;
}

const StepNavigation = ({ title }: StepNavigationProps) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  // title과 일치하는 Step 찾기
  useEffect(() => {
    const matchedIndex = STEPS.findIndex((step) => step === title);
    if (matchedIndex !== -1) {
      setActiveStep(matchedIndex + 1);
    }
  }, [title]);

  return (
    <NavContainer>
      <Step>
        {STEPS.map((step, index) => (
          <StepItem key={index} $active={step === title}>
            {step}
            {index !== STEPS.length - 1 && <ChevronRightGray />}
          </StepItem>
        ))}
      </Step>
    </NavContainer>
  );
};
export default StepNavigation;

// Styled Components
const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #adb5bd;
  position: relative;
  padding-bottom: 5px;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  @media (max-width: 700px) {
    font-size: 13px;
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepItem = styled.div<{ $active?: boolean }>`
  color: ${(props) => (props.$active ? "#343a40" : "#adb5bd")};
  font-weight: ${(props) => (props.$active ? "600" : "normal")};
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  display: flex;
  align-items: center;

  &:not(:last-child) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &::after {
      content: "";
      display: none; /* 기존 스타일 숨김 */
    }

    & > svg {
      margin-left: 10px;
      padding: 5px;
      border: #b5c1d2;
      background-color: #edf2f8;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
`;
