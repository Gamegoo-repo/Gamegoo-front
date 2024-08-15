"use client";

import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import { TERMS } from "@/data/terms";
import { updateTerms } from "@/redux/slices/signInSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Terms = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [terms, setTerms] = useState<boolean[]>([false, false, false]);

  const termsRedux = useSelector((state: RootState) => state.signIn.terms);

  /* redux 업데이트 */
  useEffect(() => {
    setTerms(terms);
  }, [termsRedux]);

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const newTerms = [...terms];
    newTerms[index] = isChecked;
    setTerms(newTerms);
  };

  const handleNext = async () => {
    dispatch(updateTerms(terms));
    router.push("/join/email");
  };

  const allRequiredChecked = TERMS.every(
    (term, index) => !term.require || (term.require && terms[index])
  );

  return (
    <Div>
      <Label>아래 이용 약관을 확인해주세요.</Label>
      <CheckList>
        {TERMS.map((item, index) => (
          <Checkbox
            key={item.id}
            value="terms"
            isChecked={terms[index]}
            onChange={(isChecked) => handleCheckboxChange(index, isChecked)}
            fontSize="regular16"
            color="darkGray100"
          >
            {item.text}
          </Checkbox>
        ))}
      </CheckList>
      <Button
        buttonType="primary"
        text="다음"
        onClick={handleNext}
        disabled={!allRequiredChecked}
      />
    </Div>
  );
};

export default Terms;

const Div = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular25};
  margin-bottom: 62px;
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 45px;
`;
