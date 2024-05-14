import { theme } from "@/styles/theme";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface msgCountProps {
    count: number
}

let _width = 418;
let _height = 716;
let _left = Math.ceil((window.screen.width - _width) / 2);
let _top = Math.ceil((window.screen.height - _height) / 2);

const ChatBox = (props: msgCountProps) => {
    // const [browserWindow, setBrowserWindow] = useState<Window | null>(null);

    // const handleChatOpen = () => {
    //     const newWindow = window.open("https://naver.com", "_blank", 'width=' + _width + ', height=' + _height + ', left=' + _left + ', top=' + _top);
    //     if (newWindow) {
    //         setBrowserWindow(newWindow);
    //     }
    // };

    // const handleChatClose = () => {
    //     if (browserWindow) {
    //         browserWindow.close();
    //         setBrowserWindow(null);
    //     } else {
    //         console.error('창이 열려있지 않습니다.');
    //     }
    // }

    return (
        // <div onClick={browserWindow ? handleChatClose : handleChatOpen}>
        //     <MsgButton>
        //         <Image
        //             src='/assets/icons/chat_box.svg'
        //             width={36}
        //             height={34}
        //             alt='chat box'
        //         />
        //         <MsgCount>
        //             <Count>{props.count}</Count>
        //         </MsgCount>
        //     </MsgButton>
        // </div>
        <div>
    
      </div>

    )
};

export default ChatBox;

const MsgButton = styled.div`
            position: relative;
            width: 89px;
            height: 89px;
            border-radius: 50%;
            background: #7967EB;
            cursor: pointer;
            img{
                position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
    }
            `

const MsgCount = styled.div`
            position: relative;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border:1px solid ${theme.colors.purple200};
            background: ${theme.colors.white};
            left:72%;
            `

const Count = styled.p`
            ${(props) => props.theme.fonts.semiBold14};
            color:${theme.colors.purple100};
            position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
            `

