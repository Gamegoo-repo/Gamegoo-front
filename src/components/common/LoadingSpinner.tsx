import styled, { keyframes } from 'styled-components';
import { theme } from "@/styles/theme";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid ${theme.colors.purple100};
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`;

const LoadingSpinner: React.FC = () => (
  <Spinner />
);

export default LoadingSpinner;