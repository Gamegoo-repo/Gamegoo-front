import styled from "styled-components";
import Modal from "./Modal";
import Dropdown from "../common/Dropdown";
import Image from "next/image";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import PositionBox from "./PositionBox";
import UserInfo from "./UserInfo";
import Test from "./Test";

interface WritingProps {
    onClose: () => void;
}

const DROP_DATA = [
    { id: 1, value: '솔로1' },
    { id: 2, value: '솔로2' },
    { id: 3, value: '솔로3' },
];


const WritePost = (props: WritingProps) => {
    const { onClose } = props;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDropOption, setSelectedDropOption] = useState('솔로 랭크');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [imageUploadResult, setImageUploadResult] = useState<any>(null);
    const [profileImg, setProfileImg] = useState<File | null>(null);
    const [openPosition, setOpenPosition] = useState(false);
    const [isPositionValue, setIsPositionValue] = useState("");
    const [textareaValue, setTextareaValue] = useState("");

    const handleDropValue = (value: string) => {
        console.log(value)
        setSelectedDropOption(value);
        setIsDropdownOpen(false);
    };

    const handleDropdownClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleDropdownClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleDropdownClickOutside);
        };
    }, []);

    const handleFileSelect = (file: File) => {
        setProfileImg(file);
    };

    // TODO: api 연결
    // const handleProfileUpload = async () => {
    //     if (!profileImg) return;

    //     const formData = new FormData();

    //     const config = {
    //         header: { "content-type": "multipart/form-data" },
    //     };

    //     formData.append('file', profileImg);

    //     try {
    //         const response = await axios.post(
    //             '/api/',
    //             formData,
    //             config
    //         );
    //         console.log('Success:', response.data);
    //         setImageUploadResult(response.data);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const handlePositionClose = () => {
        setOpenPosition(false);
    };

    const handlePosition = (value: string) => {
        setIsPositionValue(value)
        setOpenPosition(false);
    };

    return (
        <Modal
            type='writing'
            width='565px'
            height='959px'
            onClose={onClose}
            buttonText='확인'>
            <UserInfo
                onFileSelect={handleFileSelect} />
            <QueueSection>
                <Title>큐타입</Title>
                <Dropdown
                    ref={dropdownRef}
                    type="type2"
                    padding="10px 13px"
                    width="243px"
                    list={DROP_DATA}
                    open={isDropdownOpen}
                    setOpen={setIsDropdownOpen}
                    onDropValue={handleDropValue}
                    defaultValue={selectedDropOption}
                />
            </QueueSection>
            <PositionSection>
                <Title>포지션</Title>
                {/* <PositionBox
                    // onClose={handlePositionClose}
                    handlePositionValue={handlePosition}/> */}
                    <Test/>
            </PositionSection>
            <StyleSection>
                <Title>게임 스타일</Title>
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

const QueueSection = styled.div`
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
