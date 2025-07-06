import styled from "styled-components";
import { FC } from "react";
import MannerLevel from "../../MannerLevel";
import MannerLevelBox from "../../MannerLevelBox";

interface UserNMannerProps {
  mannerLevel: number;
  memberId: number;
  isMannerLevelBoxOpen: boolean;
  onMannerLevelBoxToggle: () => void;
  mannerLevelBoxRef: React.RefObject<HTMLDivElement>;
}

const UserNManner: FC<UserNMannerProps> = ({
  mannerLevel,
  memberId,
  isMannerLevelBoxOpen,
  onMannerLevelBoxToggle,
  mannerLevelBoxRef,
}) => {
  return (
    <Wrapper>
      <MannerLevelWrapper>
        <MannerLevel
          level={mannerLevel}
          onClick={onMannerLevelBoxToggle}
          position="board"
          isBubbleHide={true}
        />
        {isMannerLevelBoxOpen && (
          <div ref={mannerLevelBoxRef}>
            <MannerLevelBox
              memberId={memberId}
              level={mannerLevel}
              top="30px"
              right="-780%"
              tail={true}
              tailPosition="top"
              onClose={() => {}}
            />
          </div>
        )}
      </MannerLevelWrapper>
    </Wrapper>
  );
};

export default UserNManner;

const Wrapper = styled.div`
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
`;

const MannerLevelWrapper = styled.div`
  position: relative;
`;
