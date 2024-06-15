import styled from "styled-components";
import Image from "next/image";

interface ReportProps {
    onClick: (e: React.MouseEvent) => void;
}

const Report = (props: ReportProps) => {
    const { onClick } = props;

    return (
        <Wrapper>
            <ReportImage
                onClick={onClick}
                src="/assets/icons/three_dots_button.svg"
                width={3}
                height={15}
                alt="report button" />
        </Wrapper>
    )
};

export default Report;

const Wrapper = styled.div`
    margin-left:26px;
`;

const ReportImage = styled(Image)`
    cursor: pointer;
`;

