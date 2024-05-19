import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

interface TableTitleProps {
    id: number;
    name: string;
};

interface TableContentProps {
    id: number;
    image: string;
    account: string;
    manner_lev: number;
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
    function setPosition(tier: number) {
        switch (tier) {
            case 0:
                return '/assets/icons/position_main.svg';
            case 1:
                return '/assets/icons/position_sub.svg';

        }
    }
    return (
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
                    const position_main = setPosition(value.main_position);

                    return (
                        <Row key={value.id}>
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
                                    src="/assets/icons/tier_bronze.svg"
                                    width={26}
                                    height={13}
                                    alt="profile image"
                                />
                                <P>{value.tier}</P>
                            </Third>
                            <Fourth className="table_width">
                                <P>{value.main_position}</P>
                                <P>{value.sub_position}</P>
                                {/* <Image
                                    src={position_main}
                                    width={35}
                                    height={28}
                                    alt="main position icon"
                                />
                                <Image
                                    src={$h.setPosition(value.sub_position)}
                                    width={26}
                                    height={25}
                                    alt="sub position icon"
                                /> */}
                            </Fourth>
                            <Fifth className="table_width">
                                <Image
                                    src='/assets/icons/position3.svg'
                                    width={26}
                                    height={25}
                                    alt="sub position icon"
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
                                <P>{value.date}</P>
                            </Eighth>
                        </Row>
                    )
                })}
            </TableContent>
        </TableWrapper>
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
        }

`
const TableHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:14px 21px;
    ${(props) => props.theme.fonts.bold16};
    background:#5C5C5C;
    color:${theme.colors.white};
    border-radius:8px;
`

const Title = styled.p`
    &:first-child{
        text-align: left;
    }  
`
const TableContent = styled.div`
/* .table_width {
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
    }  */
`
const Row = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:22px 21px;
    border-bottom: 1px solid #D4D4D4;
    cursor: pointer;

`

const First = styled.div`
    display: flex;
    align-items: center;
    gap:22px;
`
const Second = styled.div`
    p{
        color:${theme.colors.purple100};
        ${(props) => props.theme.fonts.bold16};
    }
`
const Third = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:2px;

`
const Fourth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:21px;
`
const Fifth = styled.div``
const Sixth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:5px;
`
const Seventh = styled.div``
const Eighth = styled.div``

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
`