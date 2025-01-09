"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import CategoryToggle from "@/components/common/CategoryToggle";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Suspense } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const PolicyLayout = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const policy = [
    { name: "이용 약관", path: "/policy?terms=service" },
    { name: "개인 정보 처리 방침", path: "/policy?terms=privacy" },
  ];

  const handleCategoryClick = (itemPath: string) => {
    if (pathname + "?" + searchParams.toString() !== itemPath) {
      router.push(itemPath);
    }
  };

  return (
    <Wrapper>
      <Title>겜구 약관 및 개인정보 보호</Title>
      <CategoryToggle
        categories={policy}
        onClick={(item) => handleCategoryClick(item.path)}
        currentPath={`${pathname}?${searchParams.toString()}`}
      />
      {children}
    </Wrapper>
  );
};

export default function PolicyLayoutPaging({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PolicyLayout>{children}</PolicyLayout>
    </Suspense>
  );
}

const Wrapper = styled.div`
  max-width: 1440px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 80px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20};
  padding-bottom: 10px;
  border-bottom: 1px solid ${theme.colors.gray600};
  margin-bottom: 20px;
`;
