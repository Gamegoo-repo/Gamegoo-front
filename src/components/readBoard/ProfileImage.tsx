import styled from "styled-components";
import Image from "next/image";
import { setProfileImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";

interface ProfileImageProps {
    image: number;
}

const ProfileImage = (props: ProfileImageProps) => {
    const { image } = props;
    const bgColor = getProfileBgColor(image);

    return (
        <Wrapper $bgColor={bgColor}>
            <StyledImage
                src={setProfileImg(image)}
                width={51}
                height={48}
                alt='프로필 이미지' />
        </Wrapper>
    )
};

export default ProfileImage;

const Wrapper = styled.div<{ $bgColor: string }>`
    position: relative;
    width: 75px;
    height: 76px;
    background: ${(props) => props.$bgColor};
    border-radius: 50%;
    margin-right: 17px;
`;
const StyledImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;