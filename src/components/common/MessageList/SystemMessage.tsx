import styled from "styled-components";

import { theme } from "@/styles/theme";

interface SystemMessageProps {
  message: string;
  onClick?: () => void;
}

const SystemMessage = ({ message, onClick }: SystemMessageProps) => {
  const highlightedText = "게시한 글";
  const parts = message.split(highlightedText);

  return (
    <SystemMessageContainer>
      {parts.length > 1 ? (
        <>
          <UnderlinedText onClick={onClick}>
            {`${parts[0]} ${highlightedText}`}
          </UnderlinedText>
          {parts[1]}
        </>
      ) : (
        message
      )}
    </SystemMessageContainer>
  );
};

export default SystemMessage;

const SystemMessageContainer = styled.div`
  width: 100%;
  text-align: center;
  padding: 4px 0px;
  background: ${theme.colors.gray700};
  ${theme.fonts.regular13};
  color: ${theme.colors.white};
  border-radius: 999px;
  margin-bottom: 11px;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;
