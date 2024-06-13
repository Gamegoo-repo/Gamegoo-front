import styled from "styled-components";
import Image from "next/image";

const Report = () => {
    return (
        <Wrapper>
            <ReportImage
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

