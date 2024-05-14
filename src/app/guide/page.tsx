"use client";

import styled from "styled-components";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useState } from "react";
import Checkbox from "@/components/common/Checkbox";
import RadioCard from "@/components/common/RadioCard";
import Dropdown from "@/components/common/Dropdown";
import ChatBox from "@/components/common/ChatBox";

const Guide = () => {
  /* Input State */
  const [inputValue, setInputValue] = useState("Input");
  const [inputValid, setInputValid] = useState("Input Valid");
  const [inputError, setInputError] = useState("Input Error");
  const [passwordValue, setPasswordValue] = useState("Password");
  const [textareaValue, setTextareaValue] = useState("Textarea");

  /* RadioCard State */
  const [isSelected, setIsSelected] = useState<string>("option1");

  const handleOptionChange = (value: string) => {
    setIsSelected(value);
    console.log(value);
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
        width='138px'
        fontSize='${(props) => props.theme.fonts.medium16}'
        bgColor='#F5F5F5' />
      <Dropdown
        type='type2'
        width='243px'
        fontSize='${(props) => props.theme.fonts.regular18}'
        bgColor='${theme.colors.white}' />

      <H2>Chat Box</H2>
      <ChatBox count={3}/>

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
