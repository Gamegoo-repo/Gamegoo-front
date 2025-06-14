import styled from "styled-components";
import { theme } from "@/styles/theme";
import Mic from "../common/Mic";
import { Mike } from "@/types/user/mike";
import { useRouter } from "next/navigation";
import useMediaQueries from "@/hooks/useMediaQueries";
import { useState } from "react";

interface UserAccountProps {
  account: string;
  memberId?: number;
  mike?: Mike;
  tag: string;
}

const UserAccount = (props: UserAccountProps) => {
  const { account, memberId, mike, tag } = props;
  const router = useRouter();
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [isAccountTouch, setIsAccountTouch] = useState(false);
  const [isTagTouch, setIsTagTouch] = useState(false);

  const handleRouteProfile = () => {
    if (memberId) {
      router.push(`/user/${memberId}`);
    }
  };
  const formatTextOverNumber = (text: string, maxLength: number) => {
    if (text.length >= maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };
  return (
    <Wrapper>
      <Row>
        <Account onClick={handleRouteProfile}>
          {isMobile && account.length >= 14 ? (
            <Text
              onMouseDown={() => {
                setIsAccountTouch((prev) => !prev);
                setIsTagTouch(false);
              }}
            >
              {formatTextOverNumber(account, 14)}
              {isAccountTouch && <TextModal>{account}</TextModal>}
            </Text>
          ) : (
            account
          )}
        </Account>
        {mike && <Mic status={mike} />}
      </Row>
      {tag && (
        <Tag>
          {isMobile && tag.length >= 20 ? (
            <Text
              onMouseDown={() => {
                setIsTagTouch((prev) => !prev);
                setIsAccountTouch(false);
              }}
            >
              {`#${formatTextOverNumber(tag, 20)}`}
              {isTagTouch && <TextModal>{tag}</TextModal>}
            </Text>
          ) : (
            <>{`#${tag}`}</>
          )}
        </Tag>
      )}
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

const Text = styled.p`
  position: relative;
`;

const TextModal = styled.div`
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.semiBold14};
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  border-radius: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);

  &::after {
    /* tail css */
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-top: 0 solid transparent;
    border-left: 4.5px solid transparent;
    border-right: 4.5px solid transparent;
    border-bottom: 10px solid rgba(0, 0, 0, 0.64);
  }
`;

const Tag = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray500};

  @media (max-width: 700px) {
    ${(props) => props.theme.fonts.semiBold12};
  }
`;
