import styled from "styled-components";
import Image from "next/image";
import { setProfileImg } from "@/utils/custom";

interface ProfileImageProps {
    image: string;
}

const ProfileImage = (props: ProfileImageProps) => {
    const { image } = props;

    return (
        <Wrapper>
            <StyledImage
                src={setProfileImg(image)}
                width={51}
                height={48}
                alt='프로필 이미지' />
        </Wrapper>
    )
};

export default ProfileImage;

const Wrapper = styled.div`
    position: relative;
    width: 75px;
    height: 75px;
    background: #C3B9FF;
    border-radius: 50%;
    margin-right: 17px;
`;
const StyledImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;