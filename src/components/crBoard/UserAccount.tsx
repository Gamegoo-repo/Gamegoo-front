import styled from "styled-components";
import { theme } from "@/styles/theme";
import Mic from "../common/Mic";
import { Mike } from "@/types/user/mike";

interface UserAccountProps {
  account: string;
  mike: Mike;
  tag: string;
}

const UserAccount = (props: UserAccountProps) => {
  const { account, mike, tag } = props;

  return (
    <Wrapper>
      <Row>
        <Account>{account}</Account>
        <Mic status={mike} />
      </Row>
      {tag && <Tag>#{tag}</Tag>}
    </Wrapper>
  );
};

export default UserAccount;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Account = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray700};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.bold16};
  }
`;

const Tag = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray500};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold12};
  }
`;
