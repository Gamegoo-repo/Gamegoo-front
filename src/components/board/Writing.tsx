import styled from "styled-components";
import { theme } from "@/styles/theme";
import Modal from "./Modal";
import Dropdown from "../common/Dropdown";
import Image from "next/image";
import Input from "../common/Input";
import { useRef, useState } from "react";
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

const WritePost = (props: WritingProps) => {
    const { onClose } = props;

    const [textareaValue, setTextareaValue] = useState("");

    // const [pickedImage, setPickedImage] = useState('/assets/icons/profile_img.svg' || null);
    // const imageInput = useRef();

    // function handlePickClick() {
    //     imageInput.current.click();
    // }

    // const fileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     handleInputFile(event.target.files)
    // }

    // const handleInputFile=(files: React.ChangeEvent<HTMLInputElement>)=> {
    //     if (files.length) {
    //         let file = pickedImage[0];
    //         setPickedImage(file);
    //         filePreview(file);
    //     }
    // }

    // const filePreview = (file:Blob) => {
    //     let reader = new FileReader()
    //     reader.onload = () => {
    //         setPickedImage(reader.result);
    //     }
    //     reader.readAsDataURL(file)
    // },

    // const save = ()=>{
    //     const form = new FormData();
    //     form.append("pickedImage", pickedImage);
    // },


    return (
        <Modal
            type='writing'
            width='565px'
            height='959px'
            onClose={onClose}
            buttonText='확인'
        >
            <UserInfo />

            <QueSection>
                <Title>큐타입</Title>
                <Dropdown
                    type='type2'
                    name='솔로 랭크'
                    width='243px'
                    list={DROP_DATA} />
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
