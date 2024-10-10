import styled from "styled-components";
import { theme } from "@/styles/theme";
import { setAbbrevTier } from "@/utils/custom";
import { toLowerCaseString } from "@/utils/string";

interface UserProps {
  account: string;
  tag: string;
  tier: string;
  rank: number;
}

const User = (props: UserProps) => {
  const { account, tag, tier, rank } = props;

  return (
    <Wrapper>
      <UserAccount>
        <Account>{account}</Account>
        {tag && <Tag>#{tag}</Tag>}
      </UserAccount>
      <UserTier>
        {tier && (
          <>
            <ProfileImage
              data={
                !tier
                  ? "/assets/images/tier/unranked.svg"
                  : `/assets/images/tier/${toLowerCaseString(tier)}.svg`
              }
              width={32}
              height={20}
            />
            <Tier>
              {!tier ? "UR" : setAbbrevTier(tier)}
              {tier !== "UNRANKED" && rank}
            </Tier>
          </>
        )}
      </UserTier>
    </Wrapper>
  );
};

export default User;

const Wrapper = styled.div``;

const UserAccount = styled.div`
  display: flex;
  align-items: center;
`;

const Account = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.black};
`;

const Tag = styled.p`
  ${(props) => props.theme.fonts.regular20};
  color: ${theme.colors.gray300};
  margin-left: 5px;
`;

const UserTier = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ProfileImage = styled.object`
    pointer-events: none;
`;

const Tier = styled.p`
  ${(props) => props.theme.fonts.regular18};
  color: #44515c;
`;
