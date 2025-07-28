import styled from "styled-components";

import Icon from "@/components/common/Icon";

const FeedbackMessage = ({ onEvaluate }: { onEvaluate: () => void }) => (
  <FeedbackDiv>
    <FeedbackContainer>
      <Feedback>
        <Icon
          backgroundUrl="/assets/icons/clicked_smile.svg"
          width={22}
          height={22}
          style={{ marginBottom: "7px" }}
        />
        <Text>매칭은 어떠셨나요?</Text>
        <Text>상대방의 매너를 평가해주세요!</Text>
        <StyledButton onClick={onEvaluate}>매너평가 하기</StyledButton>
      </Feedback>
    </FeedbackContainer>
  </FeedbackDiv>
);

export default FeedbackMessage;

const FeedbackDiv = styled.div`
  margin: 35px auto;
  width: 338px;
`;

const FeedbackContainer = styled.div``;

const Feedback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 40px;
  border: 1px solid ${(props) => props.theme.colors.violet300};
  background: ${(props) => props.theme.colors.violet100};
  border-radius: 13px;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.regular13};
  color: ${(props) => props.theme.colors.gray800};
  &:first-child {
    margin-bottom: 5px;
  }
`;

const StyledButton = styled.button`
  width: 119px;
  border-radius: 53px;
  margin-top: 12px;
  ${(props) => props.theme.fonts.semiBold13};
  background: ${(props) => props.theme.colors.violet600};
  color: ${(props) => props.theme.colors.white};
  padding: 8px 24px;
`;
