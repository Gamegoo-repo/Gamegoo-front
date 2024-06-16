import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

interface UserProps {
    account: string;
    tag: string;
    tier: string;
}

const User = (props: UserProps) => {
    const { account, tag, tier } = props;

    return (
        <Wrapper>
            <UserAccount>
                <Account>{account}</Account>
                <Tag>#{tag}</Tag>
            </UserAccount>
            <UserTier>
                {/* TODO:api 연결 후 수정 필 */}
                <Image
                    src="/assets/icons/tier_bronze.svg"
                    width={32}
                    height={21}
                    alt="tier image"
                />
                <Tier>{tier}</Tier>
            </UserTier>
        </Wrapper>
    )

};

export default User;

const Wrapper = styled.div``

const UserAccount = styled.div`
    display: flex;
    align-items: center;
`;

const Account = styled.p`
    ${(props) => props.theme.fonts.bold22};
    color:${theme.colors.black};
`;

const Tag = styled.p`
    ${(props) => props.theme.fonts.regular25};
    color:${theme.colors.gray300};
    margin-left: 5px;
`;

const UserTier = styled.div`
    display: flex;
    align-items: center;
    gap:2px;
`;

const Tier = styled.p`
    ${(props) => props.theme.fonts.regular20};
    color:#44515C;
`;