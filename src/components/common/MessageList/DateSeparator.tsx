import styled from "styled-components";

const DateSeparator = ({ date }: { date: string }) => {
  return <Timestamp>{date}</Timestamp>;
};

export default DateSeparator;

const Timestamp = styled.p`
  margin: 10px auto;
  text-align: center;
  border-radius: 14px;
  ${(props) => props.theme.fonts.medium11};
  color: ${(props) => props.theme.colors.gray700};
  white-space: nowrap;
`;
