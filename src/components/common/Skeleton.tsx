import styled, { keyframes } from "styled-components";

interface SkeletonProps {
  width?: string;
  height?: string;
  $marginBottom?: string;
  borderRadius?: string;
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonWrapper = styled.div`
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 25%,
    #f0f0f0 50%,
    #e0e0e0 75%
  );
  background-size: 400px 100%;
  animation: ${shimmer} 0.8s infinite linear;
  border-radius: 5px;
`;

export const SkeletonBox = styled(SkeletonWrapper)<SkeletonProps>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100px"};
  border-radius: ${(props) => props.borderRadius || "5px"};
`;

export const SkeletonCircle = styled(SkeletonWrapper)<SkeletonProps>`
  width: ${(props) => props.width || "50px"};
  height: ${(props) => props.height || "50px"};
  border-radius: ${(props) => props.borderRadius || "50%"};
`;

export const SkeletonText = styled(SkeletonWrapper)<SkeletonProps>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  margin-bottom: ${(props) => props.$marginBottom || "0px"};
`;
