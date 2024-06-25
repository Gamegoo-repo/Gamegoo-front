import styled from "styled-components";
import Dropdown from "../common/Dropdown";
import Input from "../common/Input";
import { useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import axios from "axios";
import dayjs from "dayjs";
import CRModal from "../crBoard/CRModal";
import UpdateProfileImage from "./UpdateProfileImage";
import User from "../crBoard/User";
import Toggle from "../common/Toggle";
import PositionBox, { PositionState } from "../crBoard/PositionBox";

interface PostBoardProps {
    onClose: () => void;
}

const DROP_DATA = [
    { id: 1, value: '솔로1' },
    { id: 2, value: '솔로2' },
    { id: 3, value: '솔로3' },
];

const userData = {
    image: "/assets/icons/profile_img.svg",
    account: "유니콘의 비밀",
    tag: "KR1",
    tier: "B3",
    manner_level: 5,
    mic: 0,
};

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

    const [isOn, setisOn] = useState(false);


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

    const toggleHandler = () => {
        setisOn(!isOn);
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

        onClose();
    };

    return (
        <CRModal
            type='posting'
            onClose={onClose}>
            <Form onSubmit={handlePost}>
                <UserSection>
                    <UpdateProfileImage
                        onFileSelect={handleFileSelect} />
                    <User
                        account={userData.account}
                        tag={userData.tag}
                        tier={userData.tier}
                    />
                </UserSection>
                <QueueNMicSection>
                    <Div>
                        <Title className="micTitle">마이크</Title>
                        <Toggle
                            isOn={isOn}
                            onToggle={toggleHandler}
                            type="board" />
                    </Div>
                    <Div>
                        <Title className="queueTitle">큐타입</Title>
                        <Dropdown
                            ref={dropdownRef}
                            type="type2"
                            padding="11px 21px"
                            width="234px"
                            list={DROP_DATA}
                            open={isDropdownOpen}
                            setOpen={setIsDropdownOpen}
                            onDropValue={handleDropValue}
                            defaultValue={selectedDropOption}
                        />
                    </Div>
                </QueueNMicSection>
                <PositionSection>
                    <Title className="positionTitle">포지션</Title>
                    <PositionBox
                        status="posting"
                        onPositionChange={handlePositionChange} />
                </PositionSection>
                <StyleSection>
                    <Title className="gameStyleTitle">게임 스타일</Title>
                    {/* 게임 스타일 컴포넌트 */}
                </StyleSection>
                <MemoSection>
                    <Title className="memoTitle">메모</Title>
                    <Input
                        height="77px"
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
            </Form>
        </CRModal>
    )
};

export default PostBoard;

const Form = styled.form``;
const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color: #2D2D2D;
    &.micTitle {
        margin-bottom: 11px;
    }
    &.queueTitle {
        margin-bottom: 5px;
    }
    &.positionTitle {
        margin-bottom: 5px;
    }
    &.gameStyleTitle {
        margin-bottom: 5px;
    }
    &.memoTitle{
        margin-bottom: 5px;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap:17px;
`
const QueueNMicSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap:187px;
    margin-top:24px;    
`;

const Div = styled.div``;

const PositionSection = styled.div`
    margin-top:33px;    
`;

const StyleSection = styled.div`
    margin-top:34px;    
`;

const MemoSection = styled.div`
    margin-top:34px;    
`;
const ButtonContent = styled.p`
    padding:0 0 28px;
    margin-top:74px;    
    text-align: center;
`;