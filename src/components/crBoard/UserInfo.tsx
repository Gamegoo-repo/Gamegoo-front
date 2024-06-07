import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from 'axios';

interface FileInputProps {
    onFileSelect: (file: File) => void;
};
const user = {
    account: "유니콘의 비밀",
    tag: "KR1",
    tier: "B3"
}

interface userInfo { account: string; tag: string; tier: string };

const UserInfo = (props: FileInputProps) => {
    const { onFileSelect } = props;
    const [preview, setPreview] = useState<string>('/assets/icons/profile_img.svg');
    const inputRef = useRef<HTMLInputElement | null>(null);
    // const [user, setUser] = useState<userInfo>()

    // TODO: api 연결
    // useEffect(() => {
    //     axios.get('http://localhost:3001/user')
    //         .then(response => {
    //             setUser(response.data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //         });
    // }, [])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    return (
        <UserProfile>
            <ProfileImgBg>
                <ProfileImage
                    src={preview}
                    width={54}
                    height={51}
                    alt='profile image' />
                <Label htmlFor="profileImg">
                    <CameraImgBg
                        onClick={() => inputRef.current?.click()}>
                        <CameraImage
                            src="/assets/icons/camera_white.svg"
                            width={13}
                            height={10}
                            alt="edit profile image" />
                    </CameraImgBg>
                </Label>
                <HiddenInput
                    id="profileImg"
                    name="profileImg"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required />
            </ProfileImgBg>
            <UserDetail>
                <UserAccount>
                    <Account>{user?.account}</Account>
                    <Tag>#{user?.tag}</Tag>
                </UserAccount>
                <UserTier>
                    {/* TODO:api 연결 후 수정 필 */}
                    <Image
                        src="/assets/icons/tier_bronze.svg"
                        width={32}
                        height={21}
                        alt="tier image"
                    />
                    <Tier>{user?.tier}</Tier>
                </UserTier>
            </UserDetail>
        </UserProfile>
    )
};

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

const HiddenInput = styled.input`
    display: none;
`

const Label = styled.label`
    cursor: pointer;
`

const CameraImgBg = styled.div`
    position: relative;
    width: 23px;
    height: 23px; 
    background: #000000A1;
    box-shadow: 0px 0px 3.06px 0px #00000040;
    border-radius: 50%;
    top:69%; 
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