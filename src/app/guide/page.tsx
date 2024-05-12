"use client";

import styled from "styled-components";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { useState } from "react";

const Guide = () => {
  const [inputValue, setInputValue] = useState("Input");
  const [inputValid, setInputValid] = useState("Input Valid");
  const [inputError, setInputError] = useState("Input Error");
  const [passwordValue, setPasswordValue] = useState("Password");
  const [textareaValue, setTextareaValue] = useState("Textarea");

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
