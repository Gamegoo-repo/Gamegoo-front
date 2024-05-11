"use client";

import styled from "styled-components";
import Button from "@/components/common/Button";

const Guide = () => {
  return (
    <Layout>
      <h2>Button</h2>
      <Button buttonType="primary" text="Primary Button" />
      <Button buttonType="primary" text="Primary Button" disabled />
      <Button buttonType="secondary" text="Secondary Button" />
      <Button buttonType="default" text="Default Button" />
    </Layout>
  );
};

export default Guide;

const Layout = styled.div`
  padding: 80px;
`;
