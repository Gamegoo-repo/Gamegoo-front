import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { setDateFormatter, setPositionImg, setTierImg } from "@/utils/custom";
import ReadBoard from "../readBoard/ReadBoard";
import { useEffect, useState } from "react";

interface TableTitleProps {
    id: number;
    name: string;
};

interface TableContentProps {
    id: number;
    image: string;
    account: string;
    manner_lev: number;
    tierImg: number;
    tier: string;
    main_position: number;
    sub_position: number;
    hope_position: number;
    champion: string[];
    odds: number;
    date: string;
};

interface TableProps {
    title: TableTitleProps[];
    content: TableContentProps[];
};

const Table = (props: TableProps) => {
    const { title, content } = props;

    const [isOpenReadBoard, setIsOpenReadBoard] = useState(false);
    const [isReadBoardId, setIsReadBoardId] = useState<number | null>(null);

    const handlePostOpen = (id: number) => {
        setIsOpenReadBoard(true);
        setIsReadBoardId(id);
    };

    const handlePostClose = () => {
        setIsOpenReadBoard(false);
    };

    useEffect(() => {
        if (isOpenReadBoard) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpenReadBoard]);

    return (
        <>
            {isOpenReadBoard &&
                <ReadBoard onClose={handlePostClose} postId={isReadBoardId} gameType="canyon"/>
            }
            <TableWrapper>
                <TableHead>
                    {title.map(value => {
                        return (
                            <Title key={value.id} className="table_width">{value.name}</Title>
                        )
                    })}
                </TableHead>
                <TableContent>
                    {content.map(value => {
                        return (
                            <Row key={value.id}
                                onClick={() => handlePostOpen(value.id)}>
                                <First className="table_width">
                                    <Image
                                        src={value.image}
                                        width={50}
                                        height={50}
                                        alt="profile image"
                                    />
                                    <P>{value.account}</P>
                                </First>
                                <Second className="table_width">
                                    <P>LV.{value.manner_lev}</P>
                                </Second>
                                <Third className="table_width">
                                    <Image
                                        src={setTierImg(value.tierImg)}
                                        width={26}
                                        height={13}
                                        alt="profile image"
                                    />
                                    <P>{value.tier}</P>
                                </Third>
                                <Fourth className="table_width">
                                    <Image
                                        src={setPositionImg(value.main_position)}
                                        width={35}
                                        height={28}
                                        alt="main position image"
                                    />
                                    <Image
                                        src={setPositionImg(value.sub_position)}
                                        width={26}
                                        height={25}
                                        alt="main position image"
                                    />
                                </Fourth>
                                <Fifth className="table_width">
                                    <Image
                                        src={setPositionImg(value.hope_position)}
                                        width={26}
                                        height={25}
                                        alt="sub position image"
                                    />
                                </Fifth>
                                <Sixth className="table_width">
                                    {value.champion.map((data, index) => (
                                        <Image
                                            key={index}
                                            src={data}
                                            width={50}
                                            height={50}
                                            alt="champion image"
                                        />
                                    ))}
                                </Sixth>
                                <Seventh className="table_width">
                                    <P className={value.odds >= 50 ? 'emph' : 'basic'}>{value.odds}%</P>
                                </Seventh>
                                <Eighth className="table_width">
                                    <P>{setDateFormatter(value.date)}</P>
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
