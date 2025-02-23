import styled from "styled-components";
import { theme } from "@/styles/theme";
import RankTier from "../common/RankTier";
import Image from "next/image";

interface UserAccountProps {
  account: string;
  tag: string;
}

const UserAccount = (props: UserAccountProps) => {
  const { account, tag } = props;

  return (
    <Wrapper>
      <Account>{account}</Account>
      {tag && <Tag>#{tag}</Tag>}
    </Wrapper>
  );
};

export default UserAccount;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Account = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray700};
`;

const Tag = styled.p`
  ${(props) => props.theme.fonts.regular20};
  color: ${theme.colors.gray400};
  margin-left: 5px;
`;
