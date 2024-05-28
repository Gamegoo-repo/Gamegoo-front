import styled from "styled-components";
import { theme } from "@/styles/theme";
import Modal from "./Modal";
import Dropdown from "../common/Dropdown";
import Image from "next/image";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import PositionBox from "./PositionBox";
import UserInfo from "./UserInfo";
import GameStyle from "./GameStyle";

interface WritingProps {
    onClose: () => void;
}

const DROP_DATA = [
    { id: 1, value: '솔로1' },
    { id: 2, value: '솔로2' },
    { id: 3, value: '솔로3' },
];

interface UserInterface {
    image: File | null;
    account: string;
    tag: string;
    tier: string;
};

const WritePost = (props: WritingProps) => {
    const { onClose } = props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userInfo, setUserInfo] = useState<UserInterface>({
        image: null,
        account: "유니콘의 비밀",
        tag: "KR1",
        tier: 'B3'
    });
    const [imageUploadResult, setImageUploadResult] = useState<any>(null);
    const [textareaValue, setTextareaValue] = useState("");

    const handleDropdownClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClickOutside);
        };
    }, []);



    const handleFileSelect = (file: File) => {
        setUserInfo({ ...userInfo, image: file });
    };

    // TODO: api 연결
    // const handleProfileUpload = async () => {
    //     if (!image) return;

    //     const formData = new FormData();
    //     formData.append('file', image);

    //     try {
    //         const response = await axios.post('/api/', formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         console.log('Success:', response.data);
    //         setImageUploadResult(response.data);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    return (
        <Modal
            type='writing'
            width='565px'
            height='959px'
            onClose={onClose}
            buttonText='확인'>
            <UserInfo
                onFileSelect={handleFileSelect}
                userInfo={userInfo} />
            <QueSection>
                <Title>큐타입</Title>
                <Dropdown
                    ref={dropdownRef}
                    type="type2"
                    name="솔로 랭크"
                    padding="10px 13px"
                    width="243px"
                    list={DROP_DATA}
                    open={isOpen}
                    setOpen={setIsOpen}
                />
            </QueSection>
            <PositionSection>
                <Title>포지션</Title>
                <PositionBox />
            </PositionSection>
            <StyleSection>
                <Title>게임 스타일</Title>
                <GameStyle />
            </StyleSection>
            <MicSection>
                <Title>마이크</Title>
                {/* 마이크 컴포넌트 */}
            </MicSection>
            <MemoSection>
                <Title>메모</Title>
                <Input
                    inputType="textarea"
                    value={textareaValue}
                    onChange={(value) => {
                        setTextareaValue(value);
                    }} />
            </MemoSection>
        </Modal>
    )
};

export default WritePost;

const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
    margin-bottom:4px;
`

const QueSection = styled.div`
    margin-top:24px;    
`

const PositionSection = styled.div`
    margin-top:17px;    
`

const StyleSection = styled.div`
    margin-top:34px;    
`
const MicSection = styled.div`
    margin-top:31px;    
`
const MemoSection = styled.div`
    margin-top:30px;    
`
