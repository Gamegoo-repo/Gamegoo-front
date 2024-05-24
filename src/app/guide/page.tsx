"use client";

import styled from "styled-components";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useRef, useState } from "react";
import Checkbox from "@/components/common/Checkbox";
import RadioCard from "@/components/common/RadioCard";
import Dropdown from "@/components/common/Dropdown";
import ChatBox from "@/components/common/ChatBox";
import ConfirmModal from "@/components/common/ConfirmModal";
import FormModal from "@/components/common/FormModal";
import PositionCategory from "@/components/common/PositionCategory";

const DROP_DATA1 = [
  { id: 1, value: '솔로1' },
  { id: 2, value: '솔로2' },
  { id: 3, value: '솔로3' },
];

const DROP_DATA2 = [
  { id: 1, value: '티어1' },
  { id: 2, value: '티어2' },
  { id: 3, value: '티어3' },
];

const Guide = () => {
  const dropdownRef = useRef();
  /* Input State */
  const [inputValue, setInputValue] = useState("Input");
  const [inputValid, setInputValid] = useState("Input Valid");
  const [inputError, setInputError] = useState("Input Error");
  const [passwordValue, setPasswordValue] = useState("Password");
  const [textareaValue, setTextareaValue] = useState("Textarea");

  /* RadioCard State */
  const [isSelected, setIsSelected] = useState<string>("option1");

  /* Modal */
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openFormModal, setOpenFormModal] = useState(false);

  /* Position category */
  const [openPosition, setOpenPosition] = useState(false);
  const [isPosition, setIsPosition] = useState('');

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

  const handlePosition = (value: string) => {
    setIsPosition(value)
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
      <H2>Checkbox</H2>
      <Checkbox value="checkbox1" label="checkbox" />
      <Checkbox value="checkbox2" label="checkbox" />
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

      <H2>Dropdown</H2>
      <Dropdown
        type='type1'
        name='솔로 랭크'
        width='138px'
        fontSize='20px'
        bgColor="#F5F5F5"
        list={DROP_DATA1} />
      <p>TYPE 1</p>

      <Dropdown
        type='type2'
        name='티어 선택'
        width='243px'
        fontSize='${(props) => props.theme.fonts.regular18}'
        bgColor='${theme.colors.white}'
        list={DROP_DATA2} />
      <p>TYPE 2</p>


      <H2>Chat Box</H2>
      <ChatBox count={3} />

      <H2>Confirm Modal</H2>
      <button
        style={{ border: '1px solid black', padding: '10px' }}
        onClick={handleConfirmModalOpen}>매너 평가 모달 열기 버튼
      </button>

      {openConfirmModal &&
        <ConfirmModal type='img' width='315px' onClose={handleConfirmModalClose} />
      }
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
        style={{ border: '1px solid black', padding: '10px' }}
        onClick={handleFormModalOpen}>텍스트 모달 열기 버튼
      </button>

      {/* {openFormModal &&
        <FormModal
          type='text'
          title='비밀번호 재설정하기'
          width='492px'
          height="616px"
          closeButtonWidth={15}
          closeButtonHeight={15}
          borderRadius='20px'
          buttonText="비밀번호 재설정"
          onClose={handleFormModalClose}>
          <Input
            inputType="password"
            value={passwordValue}
            label="label"
            onChange={(value) => {
              setPasswordValue(value);
            }}
            placeholder="placeholder"
          />
        </FormModal>
      }
      <p>Text Modal</p> */}

      {/* 같은 변수 사용으로 주석처리 해놨습니다.*/}
      {openFormModal &&
        <FormModal
          type='checkbox'
          title='매너 평가하기'
          width='418px'
          height="434px"
          closeButtonWidth={17}
          closeButtonHeight={17}
          borderRadius='10px'
          buttonText="완료"
          onClose={handleFormModalClose}
          disabled>
          <Checkbox value="checkbox1" label="checkbox" />
        </FormModal>
      }
      <p>Checkbox Modal</p>

      <H2>Position</H2>
      <button
        style={{ border: '1px solid black', padding: '10px' }}
        onClick={() => setOpenPosition(true)}>포지션 열기 버튼
      </button>
      {openPosition &&
        <PositionCategory 
        onClose={handlePositionClose}
        onSetPosition={handlePosition} />}


    </Layout>
  );
};

export default Guide;

const Layout = styled.div`
  padding: 80px;
`;

const H2 = styled.h2`
  margin: 20px 0px;
`;
