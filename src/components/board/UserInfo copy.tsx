import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { forwardRef } from "react";

interface UserInfoProps {
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageClick: any
    pickedImage: any;
}
const UserInfo = forwardRef(function UserInfo(props: UserInfoProps, ref:any) {
    const { onImageChange, onImageClick, pickedImage } = props;

    return (
        <UserProfile>
            <ProfileImgBg>
                {/* <ProfileImage
                    src='/assets/icons/profile_img.svg'
                    width={54}
                    height={51}
                    alt='profile image' />
                <CameraImgBg>
                    <CameraImage
                        src='/assets/icons/camera_white.svg'
                        width={13}
                        height={10}
                        alt='edit profile image' />
                </CameraImgBg> */}
                <label>
                    {/* <div> */}
                    {pickedImage &&
                        <ProfileImage
                            src={pickedImage}
                            alt='The image selected by the user.'
                            fill />}
                    {/* </div> */}
                    <input
                        type='file'
                        id={name}
                        accept='image/png, image/jpeg'
                        name={name}
                        ref={ref}
                        onChange={onImageChange}
                        required />
                    <button
                        type='button'
                        onClick={onImageClick}>
                        <CameraImgBg>
                            <CameraImage
                                src='/assets/icons/camera_white.svg'
                                width={13}
                                height={10}
                                alt='edit profile image' />
                        </CameraImgBg>
                    </button>
                </label>
            </ProfileImgBg>
            <UserDetail>
                <UserAccount>
                    <Account>유니콘의 비밀</Account>
                    <Tag>#KR1</Tag>
                </UserAccount>
                <UserTier>
                    <Image
                        src='/assets/icons/tier_bronze.svg'
                        width={32}
                        height={21}
                        alt='tier image'
                    />
                    <Tier>B3</Tier>
                </UserTier>
            </UserDetail>
        </UserProfile>
    )
});

export default UserInfo;

const UserProfile = styled.div`
    display:flex;
    align-items: center;
    gap:17px;
`

const ProfileImgBg = styled.div`
    position: relative;
    width: 79px;
    height: 79px;
    background: #C3B9FF;
    border-radius: 50%;
`

const UserDetail = styled.div``

const ProfileImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`

const CameraImgBg = styled.div`
    position: relative;
    width: 23px;
    height: 23px;
    background: #000000A1;
    box-shadow: 0px 0px 3.06px 0px #00000040;
    border-radius: 50%;
    top:70%;
`

const CameraImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`

const UserAccount = styled.div`
    display: flex;
    align-items: center;
    gap:5px;
`

const Account = styled.p`
   ${(props) => props.theme.fonts.bold22};
   color:${theme.colors.black};

`
const Tag = styled.p`
   ${(props) => props.theme.fonts.regular25};
   color:${theme.colors.gray300};

`

const UserTier = styled.div`
    display: flex;
    align-items: center;
    gap:2px;
`

const Tier = styled.p`
    ${(props) => props.theme.fonts.regular20};
    color:#44515C;
`