import { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

import { STEPS } from "@/constants";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

interface StepNavigationProps {
  title: string;
}

const StepNavigation = ({ title }: StepNavigationProps) => {
  const { isMobile } = useMediaQueryContext();
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
            {index !== STEPS.length - 1 && (
              <Image
                src={"/assets/icons/chevron_right_gray.svg"}
                width={20}
                height={20}
                alt="go"
              />
            )}
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
  ${(props) => props.theme.fonts.bold16};
  position: relative;
  padding-bottom: 5px;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.semiBold13};
  }
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StepItem = styled.div<{ $active?: boolean }>`
  color: ${(props) =>
    props.$active ? props.theme.colors.gray600 : props.theme.colors.gray400};
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

    & > img {
      margin-left: 10px;
      padding: 5px;
      border: #b5c1d2;
      background-color: ${theme.colors.gray200};
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }
`;
