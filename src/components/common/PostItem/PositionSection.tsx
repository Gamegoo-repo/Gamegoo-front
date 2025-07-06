import { FC } from "react";

import styled from "styled-components";

import { PositionBox } from "../../crBoard";
import { PostItemData } from "./PostItem";

interface PositionSectionProps {
  data: PostItemData;
  showPositionSection: boolean;
}

const PositionSection: FC<PositionSectionProps> = ({
  data,
  showPositionSection,
}) => {
  if (!showPositionSection) {
    return null;
  }

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
