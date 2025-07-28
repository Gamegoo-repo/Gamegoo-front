import styled from "styled-components";

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
          {parts[0]}
          <UnderlinedText onClick={onClick}>{highlightedText}</UnderlinedText>
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
  padding: 11px 0px;
  background: #000000a3;
  ${(props) => props.theme.fonts.regular12};
  color: ${(props) => props.theme.colors.white};
  border-radius: 14px;
  margin-bottom: 11px;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;
