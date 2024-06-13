import styled from "styled-components";
import Image from "next/image";

interface ProfileImageProps {
    image: string;
}

const ProfileImage = (props: ProfileImageProps) => {
    const { image } = props;

    return (
        <Wrapper>
            <StyledImage
                src={image}
                width={54}
                height={51}
                alt='profile image' />
        </Wrapper>
    )
};

export default ProfileImage;

const Wrapper = styled.div`
    position: relative;
    width: 79px;
    height: 79px;
    background: #C3B9FF;
    border-radius: 50%;
    margin-right: 23px;
`;
const StyledImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;