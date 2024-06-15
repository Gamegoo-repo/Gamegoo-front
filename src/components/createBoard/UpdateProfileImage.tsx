import styled from "styled-components";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface FileInputProps {
    onFileSelect: (file: File) => void;
}

const UpdateProfileImage = (props: FileInputProps) => {
    const { onFileSelect } = props;

    const [preview, setPreview] = useState<string>('/assets/icons/profile_img.svg');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
        }
    };

    return (
        <Wrapper>
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
                 />
        </Wrapper>
    )
};

export default UpdateProfileImage;

const Wrapper = styled.div`
    position: relative;
    width: 79px;
    height: 79px;
    background: #C3B9FF;
    border-radius: 50%;
`;

const ProfileImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;

const HiddenInput = styled.input`
    display: none;
`;

const Label = styled.label`
    cursor: pointer;
`;

const CameraImgBg = styled.div`
    position: relative;
    width: 23px;
    height: 23px; 
    background: #000000A1;
    box-shadow: 0 0 3.06px 0 #00000040;
    border-radius: 50%;
    top:69%; 
`;

const CameraImage = styled(Image)`
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;