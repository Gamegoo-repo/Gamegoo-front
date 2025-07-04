import styled from "styled-components";
import { FC } from "react";
import PositionBox from "../../crBoard/PositionBox";
import { PostItemData } from "./PostItem";

interface PositionSectionProps {
  data: PostItemData;
}

const PositionSection: FC<PositionSectionProps> = ({ data }) => {
  return (
    <Wrapper>
      <PositionBox
        status="reading"
        main={data.mainP || null}
        sub={data.subP || null}
        want={
          Array.isArray(data.wantP)
            ? data.wantP.filter((v) => v !== null)
            : null
        }
      />
    </Wrapper>
  );
};

export default PositionSection;

const Wrapper = styled.div`
  margin-bottom: 16px;
`;
