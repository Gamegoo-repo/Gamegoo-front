import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { setDateFormatter, setPositionImg, setProfileImg, setTierImg } from "@/utils/custom";
import ReadBoard from "../readBoard/ReadBoard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setCloseReadingModal, setOpenReadingModal } from "@/redux/slices/modalSlice";
import { useRouter } from "next/navigation";

interface TableTitleProps {
    id: number;
    name: string;
};

interface TableContentProps {
    boardId: number;
    memberId: number;
    profileImage: string;
    gameName: string;
    mannerLevel: number;
    tier: string;
    gameMode: number;
    mainPosition: number;
    subPosition: number;
    wantPosition: number;
    championList: number[];
    winRate: number;
    createdAt: string;
};

interface TableProps {
    title: TableTitleProps[];
    content: TableContentProps[];
};

const Table = (props: TableProps) => {
    const { title, content } = props;

    const [isBoardId, setIsBoardId] = useState<number>(0);

    const isReadingModal = useSelector((state: RootState) => state.modal.readingModal);

    const dispatch = useDispatch();
    const router = useRouter();

    /* 게시글 열기 */
    const handlePostOpen = (id: number) => {
        dispatch(setOpenReadingModal());
        setIsBoardId(id);
    };

    /* 게시글 닫기 */
    const handlePostClose = () => {
        dispatch(setCloseReadingModal());
    };

    useEffect(() => {
        if (isReadingModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isReadingModal]);

    /* 소환사명 복사 */
    const handleTextClick = async (gameName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const copied = `#${gameName.replace(/\s+/g, '')}`;
        try {
            await navigator.clipboard.writeText(copied);
        } catch (error) {
            console.error('복사 실패', error);
        }
    };

    return (
        <>
            {isReadingModal &&
                <ReadBoard onClose={handlePostClose} postId={isBoardId} gameType="canyon" />
            }
            <TableWrapper>
                <TableHead>
                    {title.map(data => {
                        return (
                            <Title key={data.id} className="table_width">{data.name}</Title>
                        )
                    })}
                </TableHead>
                <TableContent>
                    {content?.map(data => {
                        return (
                            <Row key={data.boardId}
                                onClick={() => handlePostOpen(data.boardId)}>
                                <First className="table_width">
                                    <Image
                                        src={setProfileImg(data.profileImage)}
                                        width={50}
                                        height={50}
                                        alt="프로필 이미지"
                                    />
                                    <P onClick={(e) => handleTextClick(data.gameName, e)}>{data.gameName}</P>
                                </First>
                                <Second className="table_width">
                                    {data.mannerLevel &&
                                        <P>LV.{data.mannerLevel}</P>
                                    }
                                </Second>
                                <Third className="table_width">
                                    <Image
                                        src={setTierImg(data.tier)}
                                        width={26}
                                        height={13}
                                        alt="profile image"
                                    />
                                    <P>{data.tier}</P>
                                </Third>
                                <Fourth className="table_width">
                                    <Image
                                        src={setPositionImg(data.mainPosition)}
                                        width={35}
                                        height={28}
                                        alt="main position image"
                                    />
                                    <Image
                                        src={setPositionImg(data.subPosition)}
                                        width={26}
                                        height={25}
                                        alt="main position image"
                                    />
                                </Fourth>
                                <Fifth className="table_width">
                                    <Image
                                        src={setPositionImg(data.wantPosition)}
                                        width={26}
                                        height={25}
                                        alt="sub position image"
                                    />
                                </Fifth>
                                <Sixth className="table_width">
                                    {/* {data.championList.map((data, index) => (
                                        <Image
                                            key={index}
                                            src={data}
                                            width={50}
                                            height={50}
                                            alt="champion image"
                                        />
                                    ))} */}
                                    {data.championList.map((data, index) => (
                                        // <Image
                                        //     key={index}
                                        //     src={data}
                                        //     width={50}
                                        //     height={50}
                                        //     alt="champion image"
                                        // />
                                        data
                                    ))}
                                </Sixth>
                                <Seventh className="table_width">
                                    {data.winRate &&
                                        <P className={data.winRate >= 50 ? 'emph' : 'basic'}>{data.winRate}%</P>
                                    }
                                </Seventh>
                                <Eighth className="table_width">
                                    <P>{setDateFormatter(data.createdAt)}</P>
                                </Eighth>
                            </Row>
                        )
                    })}
                </TableContent>
            </TableWrapper>
        </>
    )
};

export default Table;

const TableWrapper = styled.div`
    width: 100%;
    text-align: center;
    .table_width {
    &:first-child{
            width: 17%;
    }
    &:nth-child(2){
            width: 13%;
    }
    &:nth-child(3){
            width: 10%;
    }
    &:nth-child(4){
            width: 12%;
    }
    &:nth-child(5){
            width: 13%;
    }
    &:nth-child(6){
            width: 20%;
    }
    &:nth-child(7){
            width: 9%;
    }
    &:last-child{
            width: 11%;
    }
        }
`;

const TableHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:14px 21px;
    ${(props) => props.theme.fonts.bold16};
    background:#5C5C5C;
    color:${theme.colors.white};
    border-radius:8px;
`;

const Title = styled.p`
    &:first-child{
      text-align: left;
    }  
`;

const TableContent = styled.div``;

const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:22px 21px;
    border-bottom: 1px solid #D4D4D4;
    cursor: pointer;    
`;

const First = styled.div`
    display: flex;
    align-items: center;
    gap:22px;
`;
const Second = styled.div`
    p {
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold16};
    }
`;

const Third = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:2px;
`;

const Fourth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:21px;
`;
const Fifth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Sixth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:5px;
`;
const Seventh = styled.div``;
const Eighth = styled.div``;
const P = styled.p`
    ${(props) => props.theme.fonts.medium16};
    color:${theme.colors.black};
    &.emph{
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold16};
    }
    &.basic{
    color:${theme.colors.black};
    ${(props) => props.theme.fonts.medium16};
    }
`;
