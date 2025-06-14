import styled from "styled-components";
import { theme } from "@/styles/theme";
import Mic from "../common/Mic";
import { Mike } from "@/types/user/mike";
import { useRouter } from "next/navigation";

interface UserAccountProps {
  account: string;
  memberId?: number;
  mike?: Mike;
  tag: string;
}

const UserAccount = (props: UserAccountProps) => {
  const { account, memberId, mike, tag } = props;
  const router = useRouter();

  const handleRouteProfile = () => {
    if (memberId) {
      router.push(`/user/${memberId}`);
    }
  };
  return (
    <Wrapper>
      <Row>
        <Account onClick={handleRouteProfile}>{account}</Account>
        {mike && <Mic status={mike} />}
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

const Account = styled.button`
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
