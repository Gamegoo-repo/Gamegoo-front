import styled from "styled-components";
import Dropdown from "../common/Dropdown";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import PositionBox, { PositionState } from "./PositionBox";
import UserInfo from "./UserInfo";
import Button from "../common/Button";
import axios from "axios";
import dayjs from "dayjs";
import CRModal from "./CRModal";

interface PostBoardProps {
    onClose: () => void;
}

const DROP_DATA = [
    { id: 1, value: '솔로1' },
    { id: 2, value: '솔로2' },
    { id: 3, value: '솔로3' },
];

const PostBoard = (props: PostBoardProps) => {
    const { onClose } = props;

    const [imageUploadResult, setImageUploadResult] = useState<any>(null);
    const [profileImg, setProfileImg] = useState<File | null>(null);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDropOption, setSelectedDropOption] = useState('솔로 랭크');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [positionValue, setPositionValue] = useState<PositionState>({
        main: '',
        sub: '',
        want: ''
    });

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


    const handlePositionChange = (newPositionValue: PositionState) => {
        setPositionValue(newPositionValue);
    };

    const handlePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        const updatedDate = dayjs().format();
        formData.append('updateTime', updatedDate);
        if (profileImg) {
            formData.append('profileImg', profileImg);
        }
        formData.append('queueType', selectedDropOption);
        formData.append('position', JSON.stringify(positionValue));
        formData.append('memo', textareaValue);

        // try {
        //     const response = await axios.post('/api/', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        //     console.log('Success:', response.data);
        // } catch (error) {
        //     console.error('Error:', error);
        // }
    };

    return (
        <CRModal
            type='posting'
            onClose={onClose}>
            <form onSubmit={handlePost}>
                <UserInfo
                status="posting"
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
                    <PositionBox 
                    status="posting"
                    onPositionChange={handlePositionChange} />
                </PositionSection>
                <StyleSection>
                    <Title>게임 스타일</Title>
                    {/* 게임 스타일 컴포넌트 */}
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
                        id="memo"
                        onChange={(value) => {
                            setTextareaValue(value);
                        }} />
                </MemoSection>
                <ButtonContent>
                    <Button type="submit" buttonType="primary" text="확인" />
                </ButtonContent>
            </form>
        </CRModal>
    )
};

export default PostBoard;

const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
    margin-bottom:4px;
`;

const QueueSection = styled.div`
    margin-top:24px;    
`;

const PositionSection = styled.div`
    margin-top:17px;    
`;

const StyleSection = styled.div`
    margin-top:34px;    
`;
const MicSection = styled.div`
    margin-top:31px;    
`;
const MemoSection = styled.div`
    margin-top:30px;    
`;
const ButtonContent = styled.p`
    padding:0 45px 36px;
    margin-top:37px;    
    text-align: center;
`;