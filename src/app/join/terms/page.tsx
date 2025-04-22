"use client";

import { postRiotJoin } from "@/api/riot/join";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import TermModal from "@/components/common/TermModal";
import {
  MARKETING_TERMS,
  SERVICE_TERMS,
  PRIVATE_TERMS,
} from "@/constants/terms";
import { createTerms } from "@/data/terms";
import { notify } from "@/hooks/notify";
import { clearSignIn, updateTerms } from "@/redux/slices/signInSlice";
import { RootState } from "@/redux/store";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const Terms = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [puuid, setPuuid] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [terms, setTerms] = useState<boolean[]>([false, false, false]);
  const termsRedux = useSelector((state: RootState) => state.signIn.terms);

  const [modalData, setModalData] = useState<{
    title: string;
    content: string;
    isRequired: boolean;
    index: number;
  } | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryPuuid = url.searchParams.get("puuid");
    setPuuid(queryPuuid);
  }, []);

  /* redux 업데이트 */
  useEffect(() => {
    setTerms(termsRedux || [false, false, false]);
  }, [termsRedux]);

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const newTerms = [...terms];
    newTerms[index] = isChecked;
    setTerms(newTerms);
  };

  // const handleNext = async () => {
  //   dispatch(updateTerms(terms));
  //   router.push("/join/email");
  // };

  const handleSendJoin = async () => {
    if (puuid) {
      setIsLoading(true);
      try {
        await postRiotJoin({
          puuid,
          isAgree: terms[2],
        });
        dispatch(clearSignIn());
        router.push("/riot");
      } catch (err) {
        notify({
          text: "회원가입에 실패했습니다. 다시 시도해주세요.",
          icon: "🚫",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      notify({
        text: "Riot 로그인으로 회원가입을 진행해주세요.",
        icon: "🚫",
        type: "error",
      });
    }
  };

  const openModal = (type: string, index: number) => {
    switch (type) {
      case "SERVICE":
        setModalData({ ...SERVICE_TERMS, index });
        break;
      case "PRIVATE":
        setModalData({ ...PRIVATE_TERMS, index });
        break;
      case "MARKETING":
        setModalData({ ...MARKETING_TERMS, index });
        break;
      default:
        setModalData(null);
    }
  };

  const allRequiredChecked = createTerms((type, index) =>
    openModal(type, index)
  ).every((term, index) => !term.require || (term.require && terms[index]));

  const closeModal = () => {
    setModalData(null);
  };
  return (
    <Div>
      {/* <Label>아래 이용 약관을 확인해주세요.</Label> */}
      {modalData && (
        <TermModal
          title={modalData.title}
          content={modalData.content}
          isRequired={modalData.isRequired}
          onClose={closeModal}
        >
          {/* <Checkbox
            value="terms"
            isChecked={terms[modalData.index]}
            onChange={(isChecked) =>
              handleCheckboxChange(modalData.index, isChecked)
            }
            fontSize="regular16"
            color="darkGray100"
            gap="10px"
          >
            {
              createTerms((type, index) => openModal(type, index))[
                modalData.index
              ].text
            }
          </Checkbox> */}
        </TermModal>
      )}
      <CheckList>
        {createTerms((type, index) => openModal(type, index)).map(
          (item, index) => (
            <Checkbox
              key={item.id}
              value="terms"
              isChecked={terms[index]}
              onChange={(isChecked) => handleCheckboxChange(index, isChecked)}
              fontSize="regular16"
              color="gray700"
              gap="8px"
            >
              {item.text}
            </Checkbox>
          )
        )}
      </CheckList>
      <Button
        buttonType="primary"
        text={isLoading ? "가입 중..." : "회원가입 완료"}
        onClick={handleSendJoin}
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
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.regular25};
  margin-bottom: 62px;
`;

const CheckList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  margin-bottom: 45px;
  @media (max-width: 420px) {
    margin-bottom: 94px;
  }
`;
