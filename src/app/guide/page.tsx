"use client";

import styled from "styled-components";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useState } from "react";
import RadioCard from "@/components/common/RadioCard";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toggle from "@/components/common/Toggle";
import CompleteProfile from "@/components/match/CompleteProfile";

const Guide = () => {
  /* Input State */
  const [inputValue, setInputValue] = useState("Input");
  const [inputValid, setInputValid] = useState("Input Valid");
  const [inputError, setInputError] = useState("Input Error");
  const [passwordValue, setPasswordValue] = useState("Password");
  const [textareaValue, setTextareaValue] = useState("Textarea");

  /* RadioCard State */
  const [isSelected, setIsSelected] = useState<string>("option1");

  /* Modal State*/
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  /* Position category State */
  const [openPosition, setOpenPosition] = useState(false);
  const [isPosition, setIsPosition] = useState("");

  /* Toggle */
  const [isOn, setisOn] = useState(false);

  const handleOptionChange = (value: string) => {
    setIsSelected(value);
    console.log(value);
  };

  /* Modal (confirmModal) */
  const handleConfirmModalClose = () => {
    setOpenConfirmModal(false);
  };

  const handleConfirmModalOpen = () => {
    setOpenConfirmModal(true);
  };

  /* Modal (formModal) */
  const handleFormModalClose = () => {
    setOpenFormModal(false);
  };

  const handleFormModalOpen = () => {
    setOpenFormModal(true);
  };

  /* Position */
  const handlePositionClose = () => {
    setOpenPosition(false);
  };

  /* Toggle */
  const toggleHandler = () => {
    setisOn(!isOn);
  };
  const handlePosition = (value: string) => {
    setIsPosition(value);
    setOpenPosition(false);
  };

  return (
    <Layout>
      <H2>Button</H2>
      <Button buttonType="primary" text="Primary Button" />
      <Button buttonType="primary" text="Primary Button" disabled />
      <Button buttonType="secondary" text="Secondary Button" />
      <Button buttonType="default" text="Default Button" />
      <H2>Input</H2>
      <Input
        inputType="input"
        value={inputValue}
        label="label"
        onChange={(value) => {
          setInputValue(value);
        }}
        placeholder="placeholder"
      />
      <Input
        inputType="input"
        value={inputValid}
        label="label"
        onChange={(value) => {
          setInputValid(value);
        }}
        placeholder="placeholder"
        isValid={true}
      />
      <Input
        inputType="input"
        value={inputError}
        label="label"
        onChange={(value) => {
          setInputError(value);
        }}
        placeholder="placeholder"
        isValid={false}
      />
      <Input
        inputType="password"
        value={passwordValue}
        label="label"
        onChange={(value) => {
          setPasswordValue(value);
        }}
        placeholder="placeholder"
      />
      <Input
        inputType="textarea"
        value={textareaValue}
        label="label"
        onChange={(value) => {
          setTextareaValue(value);
        }}
        placeholder="placeholder"
      />
      <H2>RadioCard</H2>
      <RadioCard
        id="option1"
        value="option1"
        name="example"
        label="Option 1"
        selected={isSelected}
        onChange={handleOptionChange}
      />
      <RadioCard
        id="option2"
        value="option2"
        name="example"
        label="Option 2"
        selected={isSelected}
        onChange={handleOptionChange}
      />
      <RadioCard
        id="option3"
        value="option3"
        name="example"
        label="Option 3"
        selected={isSelected}
        onChange={handleOptionChange}
      />
      <p>Selected Option: {isSelected}</p>

      <H2>Confirm Modal</H2>
      <button
        style={{ border: "1px solid black", padding: "10px" }}
        onClick={handleConfirmModalOpen}
      >
        매너 평가 모달 열기 버튼
      </button>

      {openConfirmModal && (
        <ConfirmModal
          type="manner"
          width="315px"
          primaryButtonText="확인"
          onPrimaryClick={handleConfirmModalClose}
        />
      )}
      <p>Image Modal</p>

      {/* 같은 변수 사용으로 주석처리 해놨습니다.*/}
      {/* {openConfirmModal &&
        <ConfirmModal type='confirm' width='540px' onClose={handleConfirmModalClose}>계속해서 매칭을 시도하시겠습니까?</ConfirmModal>
      }

      <p>Confirm Modal</p> */}

      {/* {openConfirmModal &&
        <ConfirmModal type='yesOrNo' width='540px' onClose={handleConfirmModalClose}>
          조건에 맞는 사람이 없습니다.<br />
          같은 조건으로 글을 올린 사람이 있어요!</ConfirmModal>
      }
      <p>Yes or No Modal</p> */}

      <H2>Form Modal</H2>
      <button
        style={{ border: "1px solid black", padding: "10px" }}
        onClick={handleFormModalOpen}
      >
        텍스트 모달 열기 버튼
      </button>

      <H2>Toggle</H2>
      <Toggle isOn={isOn} onToggle={toggleHandler} />
      <H2>매칭완료 프로필</H2>
      <CompleteProfile />
    </Layout>
  );
};

export default Guide;

const Layout = styled.div`
  padding: 80px;
`;

const H2 = styled.h2`
  margin: 20px 0;
`;
